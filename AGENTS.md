# SAARTHI MASTER SYSTEM RULE (PERMANENT - NEVER REMOVE)

This is a permanent core system for SAARTHI. These rules must automatically apply to every current and future module, page, API, service, background task, scheduled job, and administrative function. No feature may bypass these rules.

====================================================================
1. PERMANENT AUDIT & ACTIVITY LOG
====================================================================

Every action performed anywhere in SAARTHI must automatically create an immutable audit log.

Log all events including but not limited to:

• User Registration
• User Login
• Logout
• Failed Login
• Password Reset
• Email Verification
• Profile Creation
• Profile Update
• Profile Suspension
• Profile Restriction
• Profile Deletion
• Role Changes
• Permission Changes
• Settings Changes
• Admin Actions
• Support Requests
• Contact Form
• File Upload/Delete
• Document Updates
• API Calls
• API Errors
• Feature Added
• Feature Updated
• Feature Removed
• UI Changes
• Database Changes
• Backup Creation
• Backup Restore
• GitHub Push
• GitHub Pull
• Deployment
• Scheduled Tasks
• Security Events
• Warnings
• Errors
• System Events

Nothing should occur without creating an audit log.

====================================================================
2. DUAL DATE SYSTEM
====================================================================

Every log must contain:

• AD Date
• BS Date
• Full Timestamp
• Timezone

Example

AD:
2026-08-05

BS:
2083-04-21

Time:
11:42:16.821 +03:00

====================================================================
3. COMPLETE CHANGE HISTORY
====================================================================

Every update must automatically generate:

Version Number
Added
Modified
Removed
Affected Modules
Affected Files
Lines Added
Lines Removed
Developer
Timestamp
Git Commit
Deployment Status
Backup Status
GitHub Status
Execution Time
Risk Level

====================================================================
4. AUTOMATIC RELEASE NOTES
====================================================================

Generate professional release notes after every successful update.

Include:

New Features
Improvements
Bug Fixes
Removed Items
Known Issues
Version
Release Date

====================================================================
5. EMAIL AUTOMATION
====================================================================

Immediately send an email whenever:

• Feature Added
• Feature Removed
• Feature Updated
• Deployment Completed
• Deployment Failed
• Backup Created
• Backup Failed
• GitHub Push
• GitHub Failure
• New User Registered
• Support Ticket Created
• Contact Form Submitted
• Security Warning
• Critical Error

Email must include:

Project Name
Version
AD Date
BS Date
Timestamp
Summary
Added
Modified
Removed
Affected Files
Deployment Status
Backup Status
Risk Level
Developer

====================================================================
6. CUSTOMER SUPPORT ADMIN CONTROL
====================================================================

The Super Admin always has full administrative authority over user accounts for customer support, maintenance, moderation, legal compliance, and security.

The Super Admin may:

• View user profile
• Edit profile
• Correct incorrect information
• Change email
• Change mobile number
• Reset password
• Suspend account
• Restrict account
• Temporarily disable account
• Permanently delete account
• Restore deleted account (if recoverable)
• Verify user
• Unverify user
• Change user roles
• Manage permissions
• Block abusive users
• Unlock locked accounts
• View login history
• View activity logs
• View support history
• Send notification
• Send email
• Force logout from all devices

Every administrative action must generate an audit log and email notification.

====================================================================
7. USER ACCOUNT SAFETY
====================================================================

Deleting a user should require confirmation and create a recoverable soft-delete record whenever possible.

Maintain complete history of:

Who performed the action
Reason
Date
Time
Old Values
New Values

====================================================================
8. DONATION SYSTEM
====================================================================

Create a Donation section inside SAARTHI.

DO NOT use placeholder or fake payment details.

Instead, display:

"Payment details have not yet been configured."

I will provide below details ask me in reply and you will display it for public in tabs:

• Bank QR Image
• Nepal QR
• ConnectIPS QR
• eSewa QR
• Khalti QR
• MORU QR
• Bank Account Name
• Bank Account Number
• Bank Name
• Branch
• eSewa ID
• Khalti ID
• MORU ID
• ConnectIPS Details
• Optional Donation Message

After successfully completing of the payment details publish it publicly.

====================================================================
9. SYSTEM REPORTS
====================================================================

Automatically generate:

Daily Report
Weekly Report
Monthly Report

Include:

Users
Registrations
Support Requests
Errors
Warnings
Deployments
GitHub Activity
Backups
System Health
Storage
Performance

====================================================================
10. SECURITY
====================================================================

Track:

IP Address
Country
Browser
Operating System
Device
Session ID
Login Attempts
Permission Violations
Unauthorized Access
Suspicious Activity
Security Alerts

====================================================================
11. HEALTH MONITOR
====================================================================

Continuously monitor:

Application
Database
Email Service
GitHub
Deployment
Scheduled Jobs
Memory Usage
CPU Usage
Disk Usage
Backup Status

Generate alerts if anything fails.

====================================================================
12. EXPORTS
====================================================================

Allow exporting:

PDF
Excel
CSV
JSON
ZIP

====================================================================
13. IMMUTABLE AUDIT LOG
====================================================================

Audit logs are append-only.

No administrator may edit or overwrite existing audit entries. Corrections must create a new linked audit event.

====================================================================
17. AUTOMATIC GITHUB SYNCHRONIZATION AFTER EVERY UPDATE (PERMANENT RULE)
====================================================================

This is a permanent core rule for SAARTHI.
• After completing any code update, feature modification, bug fix, or data cleanup, the system MUST automatically execute a GitHub sync / backup to push the latest codebase, version bump, and release changelog to the designated GitHub repository (`sdxbyte/saarthi`).
• The AI agent must automatically trigger the backup/sync process without requiring explicit manual reminders from the user for each individual edit cycle.
• Every GitHub sync must automatically dispatch an email notification to the platform owner (`sudipadhikari8107@gmail.com`) with full release summary, version number, dual AD/BS timestamps, and commit details.



====================================================================
16. AUTHENTIC FINANCIAL & CAPITAL MARKET DATA SYSTEM (PERMANENT RULE)
====================================================================

This specification is a permanent core rule for SAARTHI. SAARTHI must use ONLY authentic, verifiable, publicly available, or officially licensed financial and capital market data.

Permanent Requirements:
• SAARTHI MUST NEVER generate fake financial information, estimate market prices, predict stock values, modify official documents, rewrite official prospectuses, display placeholder values as real data, or invent timestamps.
• Every financial record displayed MUST include: Source Name, Source Type (Official / Licensed / Public), Last Published Time, Last Sync Time, Local Fetch Time, AD Date, BS Date, Time Zone, Data Freshness Indicator, API Status, and Verification Status.
• If official data cannot be verified, display: "Official data is currently unavailable." Never substitute estimated values.
• Foreign Exchange Data Source Priority: Primary source is Nepal Rastra Bank (NRB). Only display official NRB exchange rates.
• NEPSE Live Market Priority: Official licensed NEPSE feed, licensed market data provider, or permitted public display integration. Include Live Index, Sensitive Index, Sector Index, Live Prices, Top Gainers/Losers/Turnover/Volume, Company Profiles, and Trading Status.
• IPO Module: Collect ONLY authentic IPO information (Current, Upcoming, Closed, Allotment, Listed). Each IPO page must contain Company Name, Logo, Sector, Issue Manager, Opening/Closing Dates, Issue Size, Face Value, Minimum/Maximum Units, Prospectus PDF (original public document released by issuer/regulator), Financial Statements, Auditor Report, Risk Factors, NAV, EPS, PE Ratio, Utilization of Funds, and Allotment Results. Never summarize or rewrite official prospectuses.
• Banking & Market News: Aggregate publicly available news from trusted publishers (NRB, Banking Samachar, Mero Lagani, ShareSansar, BizShala, etc.). Every article MUST display Publisher, Publication Date, Publication Time, Category, Original Thumbnail, Source Name, "Read Original" button, and "Open Original Website" button. Clearly label AI summaries if generated.
• Documents & Prospectuses: Download and serve exactly as published without modification.
• Real-time Update Engine & Audit Log: Every synchronization must log Sync ID, Module, Version, Timestamp (AD/BS), Records Updated/Added/Failed, API Status, and Error Details.


