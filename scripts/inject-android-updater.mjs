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

// 2. Write native SaarthiUpdaterPlugin.java for in-APK download + PackageInstaller launch
const updaterPluginJava = `package com.sdxbyte.saarthi;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "SaarthiUpdater")
public class SaarthiUpdaterPlugin extends Plugin {
    private static final ExecutorService DOWNLOAD_EXECUTOR = Executors.newSingleThreadExecutor();

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

    private void emitProgress(int percent, long downloaded, long total, String stage, String message) {
        JSObject payload = new JSObject();
        payload.put("percent", percent);
        payload.put("downloadedBytes", downloaded);
        payload.put("totalBytes", total);
        payload.put("stage", stage);
        if (message != null) {
            payload.put("message", message);
        }
        notifyListeners("downloadProgress", payload);
    }

    @PluginMethod
    public void getAppBuildInfo(PluginCall call) {
        try {
            Context ctx = getContext();
            PackageManager pm = ctx.getPackageManager();
            PackageInfo info = pm.getPackageInfo(ctx.getPackageName(), 0);
            long versionCode = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
                ? info.getLongVersionCode()
                : (long) info.versionCode;
            boolean canInstall = Build.VERSION.SDK_INT < Build.VERSION_CODES.O
                || pm.canRequestPackageInstalls();

            JSObject ret = new JSObject();
            ret.put("packageName", ctx.getPackageName());
            ret.put("versionName", info.versionName != null ? info.versionName : "");
            ret.put("versionCode", versionCode);
            ret.put("canInstallPackages", canInstall);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Unable to read package info: " + e.getMessage());
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
    public void downloadAndInstallApk(PluginCall call) {
        final String apkUrl = call.getString("url");
        if (!isAllowedApkUrl(apkUrl)) {
            call.reject("Invalid APK update URL.");
            return;
        }

        DOWNLOAD_EXECUTOR.execute(() -> {
            HttpURLConnection conn = null;
            try {
                Context ctx = getContext();
                emitProgress(1, 0, 0, "downloading", "Connecting to GitHub release server...");

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
                File outFile = new File(ctx.getCacheDir(), "saarthi-update.apk");
                if (outFile.exists()) {
                    //noinspection ResultOfMethodCallIgnored
                    outFile.delete();
                }

                byte[] buffer = new byte[16384];
                long downloaded = 0;
                int lastPercent = 1;

                try (InputStream in = new BufferedInputStream(conn.getInputStream());
                     FileOutputStream out = new FileOutputStream(outFile)) {
                    int read;
                    while ((read = in.read(buffer)) != -1) {
                        out.write(buffer, 0, read);
                        downloaded += read;
                        if (totalBytes > 0) {
                            int pct = (int) Math.min(99, (downloaded * 100L) / totalBytes);
                            if (pct > lastPercent) {
                                lastPercent = pct;
                                emitProgress(pct, downloaded, totalBytes, "downloading", "Downloading APK update (" + pct + "%)...");
                            }
                        }
                    }
                    out.flush();
                }

                if (downloaded < 100000L) {
                    throw new IllegalStateException("Downloaded APK file appears incomplete.");
                }

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                    && !ctx.getPackageManager().canRequestPackageInstalls()) {
                    emitProgress(100, downloaded, totalBytes, "permission_required",
                        "Grant 'Allow from this source' permission to finish installing the update.");
                    Intent settingsIntent = new Intent(
                        Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + ctx.getPackageName())
                    );
                    settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    ctx.startActivity(settingsIntent);

                    JSObject res = new JSObject();
                    res.put("needsPermission", true);
                    res.put("filePath", outFile.getAbsolutePath());
                    call.resolve(res);
                    return;
                }

                emitProgress(100, downloaded, totalBytes, "installing", "Launching Android Package Installer...");

                Uri apkUri = FileProvider.getUriForFile(
                    ctx,
                    ctx.getPackageName() + ".saarthi.fileprovider",
                    outFile
                );
                Intent installIntent = new Intent(Intent.ACTION_VIEW);
                installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                ctx.startActivity(installIntent);

                JSObject res = new JSObject();
                res.put("started", true);
                res.put("needsPermission", false);
                res.put("filePath", outFile.getAbsolutePath());
                call.resolve(res);
            } catch (Exception e) {
                emitProgress(0, 0, 0, "error", e.getMessage());
                call.reject("In-app APK update failed: " + e.getMessage());
            } finally {
                if (conn != null) conn.disconnect();
            }
        });
    }
}
`;
fs.writeFileSync(path.join(androidJavaDir, 'SaarthiUpdaterPlugin.java'), updaterPluginJava, 'utf8');

// 3. Register SaarthiUpdaterPlugin inside MainActivity.java
const mainActivityJava = `package com.sdxbyte.saarthi;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(SaarthiUpdaterPlugin.class);
        super.onCreate(savedInstanceState);
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

console.log('✅ Injected native SaarthiUpdaterPlugin, FileProvider, and REQUEST_INSTALL_PACKAGES into Capacitor Android project.');
