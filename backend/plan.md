# Root Cause Analysis & Plan: YouTube Cookie Authentication Failure

## 1. Executive Summary & Root Cause

The user encountered the following error on Coolify production:
```
[YouTubeHandler] cookies.txt path: /app/cookies.txt (Present: YES, 1580 bytes)
[YouTubeHandler] Vd6d7Cn9tTA: web player response playability status: LOGIN_REQUIRED
[YouTubeHandler] ERROR: [youtube] Vd6d7Cn9tTA: Sign in to confirm you’re not a bot.
```

### The Root Cause: "The 1,580-Byte Cookie Stripping Bug"
1. The user initially provided a full **3,253-byte** Netscape cookie file containing all critical Google authentication tokens:
   - `LOGIN_INFO` (The primary token verifying an active logged-in YouTube session)
   - `SID`, `HSID`, `SSID`, `APISID`, `SAPISID` (Core Google account identity credentials)
   - `__Secure-1PSID`, `__Secure-1PSIDCC`, `__Secure-1PAPISID`
2. When `yt-dlp --cookies backend/cookies.txt` was executed, `yt-dlp` (via Python's `http.cookiejar`) **rewrote and pruned the file on disk upon exit**.
3. It stripped away `LOGIN_INFO`, `SID`, `HSID`, `SSID`, `APISID`, and `__Secure-1PSID`, shrinking the file from **3,253 bytes down to 1,580 bytes**!
4. The Git commit `ac2c833` mistakenly committed this degraded 1,580-byte file (diff confirms line-by-line deletion of `LOGIN_INFO` and `SID`).
5. As a result, when the production container loaded `/app/cookies.txt`, it was running with **zero login credentials**, causing YouTube to return `LOGIN_REQUIRED: Sign in to confirm you're not a bot`.

---

## 2. Proper Way to Pass Cookies to `yt-dlp` (Official Documentation Review)

According to the official `yt-dlp` documentation ([yt-dlp FAQ & Extractor Guide](https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies)):

1. **Required Token Keys:**
   - `LOGIN_INFO`: Must be present and intact.
   - `SID` & `__Secure-1PSID`: Must match the Google session ID.
   - `VISITOR_INFO1_LIVE`: Visitor session identity.
2. **Preventing Cookie File Degradation:**
   - By default, `yt-dlp` writes modified session cookies back to the file specified in `--cookies`.
   - In a multi-user server environment, multiple parallel `yt-dlp` processes reading and writing to the same `/app/cookies.txt` corrupts or strips tokens.
   - **Fix:** Set file permissions to read-only (`chmod 444 /app/cookies.txt`) so `yt-dlp` uses the cookies in memory and is prevented from truncating `LOGIN_INFO` on disk!
3. **Client Strategy Order for Authenticated Sessions:**
   - Strategy 1: Standard Web client with intact cookies.
   - Strategy 2: Mobile Web (`mweb`) with intact cookies.
   - Strategy 3: TV / Android client fallback.

---

## 3. Step-by-Step Implementation Plan

### Phase 1: Restore Pristine Cookies File
- Re-write `backend/cookies.txt` with the complete, un-stripped 3,253-byte Netscape cookie dataset including `LOGIN_INFO`, `SID`, `HSID`, `SSID`, and `SAPISID`.

### Phase 2: Protect Cookie File from Overwriting
- In `backend/Dockerfile`:
  - Run `chmod 444 /app/cookies.txt` to make it read-only.
- In `backend/src/services/platforms/youtubeHandler.js`:
  - Add cookie file integrity check (verify `LOGIN_INFO` is present and log its presence).
  - Ensure `--cookies` points to the intact master file.

### Phase 3: Verification & Deployment
- Test `yt-dlp` using a non-destructive read command.
- Commit `backend/cookies.txt`, `backend/Dockerfile`, and `youtubeHandler.js`.
- Push to GitHub `origin/main` for Coolify redeployment.
