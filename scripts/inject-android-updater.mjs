import fs from 'fs';
import path from 'path';

const androidJavaDir = path.join('android', 'app', 'src', 'main', 'java', 'com', 'sdxbyte', 'saarthi');
const androidResXmlDir = path.join('android', 'app', 'src', 'main', 'res', 'xml');
const manifestPath = path.join('android', 'app', 'src', 'main', 'AndroidManifest.xml');

if (!fs.existsSync(androidJavaDir)) {
  throw new Error(`Android Java source dir not found at ${androidJavaDir}. Run npx cap add android first.`);
}

fs.mkdirSync(androidResXmlDir, { recursive: true });

// 1. Write FileProvider path definitions for cached APK updates
const filePathsXml = `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <cache-path name="apk_updates" path="." />
    <external-cache-path name="ext_apk_updates" path="." />
</paths>
`;
fs.writeFileSync(path.join(androidResXmlDir, 'saarthi_file_paths.xml'), filePathsXml, 'utf8');

// 2. Write native SaarthiUpdaterPlugin.java for background pre-download, integrity & signature check,
//    1-tap PackageInstaller launch, and native system bar theme sync.
const updaterPluginJava = `package com.sdxbyte.saarthi;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.view.View;
import android.view.Window;

import androidx.core.content.FileProvider;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "SaarthiUpdater")
public class SaarthiUpdaterPlugin extends Plugin {
    private static final ExecutorService DOWNLOAD_EXECUTOR = Executors.newSingleThreadExecutor();
    private static final String APK_FILENAME = "saarthi-update.apk";
    private static final String TMP_APK_FILENAME = "saarthi-update.apk.tmp";
    private static final String META_FILENAME = "saarthi-update.meta.json";

    private boolean isAllowedApkUrl(String rawUrl) {
        if (rawUrl == null) return false;
        try {
            Uri uri = Uri.parse(rawUrl.trim());
            if (!"https".equalsIgnoreCase(uri.getScheme())) return false;
            String host = uri.getHost();
            if (host == null) return false;
            String lower = host.toLowerCase();
            return lower.equals("github.com")
                || lower.endsWith(".github.com")
                || lower.endsWith(".githubusercontent.com")
                || lower.equals("saarthi.dpdns.org")
                || lower.endsWith(".saarthi.dpdns.org");
        } catch (Exception e) {
            return false;
        }
    }

    private void emitProgress(int percent, long downloaded, long total, String stage, String message, Boolean signatureMatches) {
        JSObject payload = new JSObject();
        payload.put("percent", percent);
        payload.put("downloadedBytes", downloaded);
        payload.put("totalBytes", total);
        payload.put("stage", stage);
        if (message != null) {
            payload.put("message", message);
        }
        if (signatureMatches != null) {
            payload.put("signatureMatches", signatureMatches);
        }
        notifyListeners("downloadProgress", payload);
    }

    private long extractVersionCode(PackageInfo info) {
        if (info == null) return 0L;
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
            ? info.getLongVersionCode()
            : (long) info.versionCode;
    }

    @SuppressWarnings("deprecation")
    private Signature[] getPackageSignatures(PackageManager pm, String packageName) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                PackageInfo info = pm.getPackageInfo(packageName, PackageManager.GET_SIGNING_CERTIFICATES);
                if (info.signingInfo != null) {
                    return info.signingInfo.hasMultipleSigners()
                        ? info.signingInfo.getApkContentsSigners()
                        : info.signingInfo.getSigningCertificateHistory();
                }
            }
            PackageInfo legacy = pm.getPackageInfo(packageName, PackageManager.GET_SIGNATURES);
            return legacy.signatures;
        } catch (Exception e) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    private Signature[] getArchiveSignatures(PackageManager pm, String apkPath) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                PackageInfo info = pm.getPackageArchiveInfo(apkPath, PackageManager.GET_SIGNING_CERTIFICATES);
                if (info != null && info.signingInfo != null) {
                    return info.signingInfo.hasMultipleSigners()
                        ? info.signingInfo.getApkContentsSigners()
                        : info.signingInfo.getSigningCertificateHistory();
                }
            }
            PackageInfo legacy = pm.getPackageArchiveInfo(apkPath, PackageManager.GET_SIGNATURES);
            return legacy != null ? legacy.signatures : null;
        } catch (Exception e) {
            return null;
        }
    }

    private String computeFirstCertSha256(Signature[] sigs) {
        if (sigs == null || sigs.length == 0 || sigs[0] == null) return "";
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(sigs[0].toByteArray());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }

    private static class CachedArchiveInspection {
        boolean valid = false;
        boolean newerThanInstalled = false;
        boolean signatureMatches = true;
        long archiveVersionCode = 0L;
        String archiveVersionName = "";
        long fileSize = 0L;
    }

    private CachedArchiveInspection inspectApkFile(Context ctx, File apkFile) {
        CachedArchiveInspection result = new CachedArchiveInspection();
        if (apkFile == null || !apkFile.exists() || apkFile.length() < 100000L) {
            return result;
        }
        try {
            PackageManager pm = ctx.getPackageManager();
            PackageInfo archiveInfo = pm.getPackageArchiveInfo(apkFile.getAbsolutePath(), 0);
            if (archiveInfo == null || !ctx.getPackageName().equals(archiveInfo.packageName)) {
                return result;
            }
            PackageInfo installedInfo = pm.getPackageInfo(ctx.getPackageName(), 0);
            long installedCode = extractVersionCode(installedInfo);
            long archiveCode = extractVersionCode(archiveInfo);

            result.valid = true;
            result.archiveVersionCode = archiveCode;
            result.archiveVersionName = archiveInfo.versionName != null ? archiveInfo.versionName : "";
            result.fileSize = apkFile.length();
            result.newerThanInstalled = archiveCode > installedCode;

            String installedCert = computeFirstCertSha256(getPackageSignatures(pm, ctx.getPackageName()));
            String archiveCert = computeFirstCertSha256(getArchiveSignatures(pm, apkFile.getAbsolutePath()));
            if (!installedCert.isEmpty() && !archiveCert.isEmpty()) {
                result.signatureMatches = Arrays.equals(
                    installedCert.getBytes(StandardCharsets.UTF_8),
                    archiveCert.getBytes(StandardCharsets.UTF_8)
                );
            }
        } catch (Exception ignored) {
            result.valid = false;
        }
        return result;
    }

    private void deleteCachedFiles(Context ctx) {
        File apkFile = new File(ctx.getCacheDir(), APK_FILENAME);
        File tmpFile = new File(ctx.getCacheDir(), TMP_APK_FILENAME);
        File metaFile = new File(ctx.getCacheDir(), META_FILENAME);
        if (apkFile.exists()) //noinspection ResultOfMethodCallIgnored
            apkFile.delete();
        if (tmpFile.exists()) //noinspection ResultOfMethodCallIgnored
            tmpFile.delete();
        if (metaFile.exists()) //noinspection ResultOfMethodCallIgnored
            metaFile.delete();
    }

    private JSONObject readMetaJson(Context ctx) {
        File metaFile = new File(ctx.getCacheDir(), META_FILENAME);
        if (!metaFile.exists()) return new JSONObject();
        try (FileInputStream fis = new FileInputStream(metaFile);
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buf = new byte[4096];
            int r;
            while ((r = fis.read(buf)) != -1) {
                bos.write(buf, 0, r);
            }
            return new JSONObject(bos.toString(StandardCharsets.UTF_8.name()));
        } catch (Exception e) {
            return new JSONObject();
        }
    }

    private void writeMetaJson(Context ctx, JSONObject meta) {
        File metaFile = new File(ctx.getCacheDir(), META_FILENAME);
        try (FileOutputStream fos = new FileOutputStream(metaFile)) {
            fos.write(meta.toString().getBytes(StandardCharsets.UTF_8));
            fos.flush();
        } catch (Exception ignored) {
        }
    }

    private boolean canInstallPackages(Context ctx) {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.O
            || ctx.getPackageManager().canRequestPackageInstalls();
    }

    private boolean launchPackageInstaller(Context ctx, File apkFile) {
        try {
            Uri apkUri = FileProvider.getUriForFile(
                ctx,
                ctx.getPackageName() + ".saarthi.fileprovider",
                apkFile
            );
            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            ctx.startActivity(installIntent);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private JSObject buildPendingStatusObject(Context ctx) {
        File apkFile = new File(ctx.getCacheDir(), APK_FILENAME);
        CachedArchiveInspection inspection = inspectApkFile(ctx, apkFile);
        if (!inspection.valid || !inspection.newerThanInstalled) {
            if (apkFile.exists()) {
                deleteCachedFiles(ctx);
            }
            JSObject empty = new JSObject();
            empty.put("hasDownloadedApk", false);
            empty.put("isNewerThanInstalled", false);
            empty.put("signatureMatches", true);
            empty.put("canInstallPackages", canInstallPackages(ctx));
            return empty;
        }

        JSONObject meta = readMetaJson(ctx);
        JSObject ret = new JSObject();
        ret.put("hasDownloadedApk", true);
        ret.put("isNewerThanInstalled", true);
        ret.put("signatureMatches", inspection.signatureMatches);
        ret.put("canInstallPackages", canInstallPackages(ctx));
        ret.put("versionCode", inspection.archiveVersionCode);
        ret.put("versionName", inspection.archiveVersionName);
        ret.put("fileSize", inspection.fileSize);
        ret.put("filePath", apkFile.getAbsolutePath());
        if (meta.has("buildNumber")) {
            ret.put("buildNumber", meta.optInt("buildNumber", 0));
        }
        ret.put("commitSha", meta.optString("commitSha", ""));
        ret.put("tagName", meta.optString("tagName", ""));
        ret.put("apkUrl", meta.optString("apkUrl", ""));
        ret.put("downloadedAt", meta.optString("downloadedAt", ""));
        return ret;
    }

    @PluginMethod
    public void getAppBuildInfo(PluginCall call) {
        try {
            Context ctx = getContext();
            PackageManager pm = ctx.getPackageManager();
            PackageInfo info = pm.getPackageInfo(ctx.getPackageName(), 0);

            JSObject ret = new JSObject();
            ret.put("packageName", ctx.getPackageName());
            ret.put("versionName", info.versionName != null ? info.versionName : "");
            ret.put("versionCode", extractVersionCode(info));
            ret.put("canInstallPackages", canInstallPackages(ctx));
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Unable to read package info: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getPendingUpdateStatus(PluginCall call) {
        try {
            call.resolve(buildPendingStatusObject(getContext()));
        } catch (Exception e) {
            call.reject("Unable to inspect pending update: " + e.getMessage());
        }
    }

    @PluginMethod
    public void clearCachedUpdate(PluginCall call) {
        try {
            deleteCachedFiles(getContext());
            JSObject ret = new JSObject();
            ret.put("cleared", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to clear cached APK: " + e.getMessage());
        }
    }

    @PluginMethod
    public void requestInstallPermission(PluginCall call) {
        try {
            Context ctx = getContext();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent settingsIntent = new Intent(
                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + ctx.getPackageName())
                );
                settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                ctx.startActivity(settingsIntent);
            }
            JSObject ret = new JSObject();
            ret.put("opened", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to open install permission settings: " + e.getMessage());
        }
    }

    @PluginMethod
    public void installDownloadedApk(PluginCall call) {
        try {
            Context ctx = getContext();
            File apkFile = new File(ctx.getCacheDir(), APK_FILENAME);
            CachedArchiveInspection inspection = inspectApkFile(ctx, apkFile);
            if (!inspection.valid || !inspection.newerThanInstalled) {
                deleteCachedFiles(ctx);
                call.reject("No valid newer APK found in cache.");
                return;
            }

            if (!canInstallPackages(ctx)) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    Intent settingsIntent = new Intent(
                        Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + ctx.getPackageName())
                    );
                    settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    ctx.startActivity(settingsIntent);
                }
                JSObject res = new JSObject();
                res.put("started", false);
                res.put("needsPermission", true);
                res.put("signatureMatches", inspection.signatureMatches);
                call.resolve(res);
                return;
            }

            boolean launched = launchPackageInstaller(ctx, apkFile);
            JSObject res = new JSObject();
            res.put("started", launched);
            res.put("needsPermission", false);
            res.put("signatureMatches", inspection.signatureMatches);
            res.put("filePath", apkFile.getAbsolutePath());
            call.resolve(res);
        } catch (Exception e) {
            call.reject("Failed to launch installer: " + e.getMessage());
        }
    }

    @PluginMethod
    public void setSystemBarsTheme(PluginCall call) {
        final boolean isDark = call.getBoolean("dark", false);
        Activity activity = getActivity();
        if (activity == null) {
            JSObject res = new JSObject();
            res.put("updated", false);
            call.resolve(res);
            return;
        }
        activity.runOnUiThread(() -> {
            try {
                Window window = activity.getWindow();
                int barColor = Color.parseColor(isDark ? "#0B1628" : "#FFFFFF");
                window.setStatusBarColor(barColor);
                window.setNavigationBarColor(barColor);
                View decorView = window.getDecorView();
                WindowInsetsControllerCompat controller = new WindowInsetsControllerCompat(window, decorView);
                controller.setAppearanceLightStatusBars(!isDark);
                controller.setAppearanceLightNavigationBars(!isDark);
                JSObject res = new JSObject();
                res.put("updated", true);
                call.resolve(res);
            } catch (Exception e) {
                JSObject res = new JSObject();
                res.put("updated", false);
                call.resolve(res);
            }
        });
    }

    @PluginMethod
    public void downloadAndInstallApk(PluginCall call) {
        final String apkUrl = call.getString("url");
        final int buildNumber = call.getInt("buildNumber", 0);
        final String commitSha = call.getString("commitSha", "");
        final String tagName = call.getString("tagName", "");
        final boolean autoInstall = call.getBoolean("autoInstall", true);

        if (!isAllowedApkUrl(apkUrl)) {
            call.reject("Invalid APK update URL.");
            return;
        }

        DOWNLOAD_EXECUTOR.execute(() -> {
            HttpURLConnection conn = null;
            Context ctx = getContext();
            try {
                // Check if this exact build is already downloaded and valid on disk (0s wait)
                File existingApk = new File(ctx.getCacheDir(), APK_FILENAME);
                CachedArchiveInspection existingCheck = inspectApkFile(ctx, existingApk);
                if (existingCheck.valid && existingCheck.newerThanInstalled) {
                    JSONObject existingMeta = readMetaJson(ctx);
                    boolean sameBuild = (buildNumber > 0 && existingMeta.optInt("buildNumber", 0) == buildNumber)
                        || (!commitSha.isEmpty() && commitSha.equals(existingMeta.optString("commitSha", "")));
                    if (sameBuild) {
                        boolean canInstall = canInstallPackages(ctx);
                        boolean started = false;
                        if (autoInstall && canInstall) {
                            started = launchPackageInstaller(ctx, existingApk);
                        }
                        emitProgress(
                            100,
                            existingCheck.fileSize,
                            existingCheck.fileSize,
                            started ? "installing" : "downloaded_ready",
                            started
                                ? "Opening installer..."
                                : "Update downloaded and ready to install.",
                            existingCheck.signatureMatches
                        );
                        JSObject res = new JSObject();
                        res.put("downloaded", true);
                        res.put("readyToInstall", true);
                        res.put("started", started);
                        res.put("needsPermission", !canInstall);
                        res.put("signatureMatches", existingCheck.signatureMatches);
                        res.put("filePath", existingApk.getAbsolutePath());
                        call.resolve(res);
                        return;
                    }
                }

                emitProgress(1, 0, 0, "downloading", "Downloading app update...", null);

                String currentUrl = apkUrl.trim();
                for (int redirects = 0; redirects < 6; redirects++) {
                    if (!isAllowedApkUrl(currentUrl)) {
                        throw new SecurityException("Blocked redirect to untrusted host: " + currentUrl);
                    }
                    URL u = new URL(currentUrl);
                    conn = (HttpURLConnection) u.openConnection();
                    conn.setInstanceFollowRedirects(false);
                    conn.setConnectTimeout(15000);
                    conn.setReadTimeout(30000);
                    conn.setRequestProperty("User-Agent", "SAARTHI-Android-Updater");
                    int code = conn.getResponseCode();
                    if (code == HttpURLConnection.HTTP_MOVED_PERM
                        || code == HttpURLConnection.HTTP_MOVED_TEMP
                        || code == HttpURLConnection.HTTP_SEE_OTHER
                        || code == 307
                        || code == 308) {
                        String nextLoc = conn.getHeaderField("Location");
                        conn.disconnect();
                        if (nextLoc == null || nextLoc.isEmpty()) {
                            throw new IllegalStateException("Empty redirect location from release host");
                        }
                        currentUrl = nextLoc;
                        continue;
                    }
                    break;
                }

                if (conn == null || conn.getResponseCode() < 200 || conn.getResponseCode() >= 300) {
                    int status = conn != null ? conn.getResponseCode() : 0;
                    throw new IllegalStateException("APK download failed with HTTP " + status);
                }

                long totalBytes = conn.getContentLengthLong();
                File tmpFile = new File(ctx.getCacheDir(), TMP_APK_FILENAME);
                if (tmpFile.exists()) {
                    //noinspection ResultOfMethodCallIgnored
                    tmpFile.delete();
                }

                byte[] buffer = new byte[16384];
                long downloaded = 0;
                int lastPercent = 1;

                try (InputStream in = new BufferedInputStream(conn.getInputStream());
                     FileOutputStream out = new FileOutputStream(tmpFile)) {
                    int read;
                    while ((read = in.read(buffer)) != -1) {
                        out.write(buffer, 0, read);
                        downloaded += read;
                        if (totalBytes > 0) {
                            int pct = (int) Math.min(99, (downloaded * 100L) / totalBytes);
                            if (pct > lastPercent) {
                                lastPercent = pct;
                                emitProgress(pct, downloaded, totalBytes, "downloading", "Downloading app update (" + pct + "%)...", null);
                            }
                        }
                    }
                    out.flush();
                }

                CachedArchiveInspection downloadedCheck = inspectApkFile(ctx, tmpFile);
                if (!downloadedCheck.valid) {
                    //noinspection ResultOfMethodCallIgnored
                    tmpFile.delete();
                    throw new IllegalStateException("Downloaded APK archive could not be verified.");
                }

                File finalFile = new File(ctx.getCacheDir(), APK_FILENAME);
                if (finalFile.exists()) {
                    //noinspection ResultOfMethodCallIgnored
                    finalFile.delete();
                }
                if (!tmpFile.renameTo(finalFile)) {
                    throw new IllegalStateException("Unable to finalize downloaded APK in cache.");
                }

                JSONObject meta = new JSONObject();
                meta.put("buildNumber", buildNumber);
                meta.put("commitSha", commitSha);
                meta.put("tagName", tagName);
                meta.put("apkUrl", apkUrl.trim());
                meta.put("versionCode", downloadedCheck.archiveVersionCode);
                meta.put("versionName", downloadedCheck.archiveVersionName);
                meta.put("fileSize", finalFile.length());
                meta.put("downloadedAt", java.time.Instant.now().toString());
                writeMetaJson(ctx, meta);

                boolean canInstall = canInstallPackages(ctx);
                boolean started = false;
                if (autoInstall && canInstall) {
                    started = launchPackageInstaller(ctx, finalFile);
                }

                emitProgress(
                    100,
                    finalFile.length(),
                    totalBytes > 0 ? totalBytes : finalFile.length(),
                    started ? "installing" : (canInstall ? "downloaded_ready" : "permission_required"),
                    started
                        ? "Opening installer..."
                        : canInstall
                            ? "Update downloaded and ready. Tap Install Update to finish."
                            : "Update downloaded! Allow 'Install unknown apps' to finish updating.",
                    downloadedCheck.signatureMatches
                );

                JSObject res = new JSObject();
                res.put("downloaded", true);
                res.put("readyToInstall", true);
                res.put("started", started);
                res.put("needsPermission", !canInstall);
                res.put("signatureMatches", downloadedCheck.signatureMatches);
                res.put("filePath", finalFile.getAbsolutePath());
                call.resolve(res);
            } catch (Exception e) {
                emitProgress(0, 0, 0, "error", e.getMessage(), null);
                call.reject("App update failed: " + e.getMessage());
            } finally {
                if (conn != null) conn.disconnect();
            }
        });
    }
}
`;
fs.writeFileSync(path.join(androidJavaDir, 'SaarthiUpdaterPlugin.java'), updaterPluginJava, 'utf8');

// 3. Register SaarthiUpdaterPlugin & clean Android hardware Back navigation inside MainActivity.java
const mainActivityJava = `package com.sdxbyte.saarthi;

import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(SaarthiUpdaterPlugin.class);
        super.onCreate(savedInstanceState);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (getBridge() != null && getBridge().getWebView() != null && getBridge().getWebView().canGoBack()) {
                    getBridge().getWebView().goBack();
                } else {
                    moveTaskToBack(true);
                }
            }
        });
    }
}
`;
fs.writeFileSync(path.join(androidJavaDir, 'MainActivity.java'), mainActivityJava, 'utf8');

// 4. Patch AndroidManifest.xml cleanly for REQUEST_INSTALL_PACKAGES and FileProvider
let manifest = fs.readFileSync(manifestPath, 'utf8');
if (!manifest.includes('android.permission.REQUEST_INSTALL_PACKAGES')) {
  manifest = manifest.replace(
    '</manifest>',
    '    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />\n</manifest>'
  );
}
if (!manifest.includes('.saarthi.fileprovider')) {
  const providerSnippet = `        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.saarthi.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/saarthi_file_paths" />
        </provider>
    </application>`;
  manifest = manifest.replace('</application>', providerSnippet);
}
fs.writeFileSync(manifestPath, manifest, 'utf8');

console.log('✅ Injected native SaarthiUpdaterPlugin (with pre-download cache + installer + system bars), FileProvider, and back-stack handling into Capacitor Android project.');
