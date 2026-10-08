# Comprehensive Plan: Dynamic Hash-Based Ad Refresh, Grid Re-Structuring & Collision Fixes

## 1. Overview & Objectives

Based on your audio feedback and screenshots:
1. **Dynamic Hash / Route Re-rendering**: When users click platform buttons above the input (`#youtubevideodownloader`, `#instagram`, `#facebook`, `#tiktok`, etc.), trigger a `useEffect` that re-renders and refreshes all ads with new creatives.
2. **Remove Left/Right Skyscraper Ads**: The fixed side skyscraper banner (`160x600`) shown on the left is creating an empty black rectangle with a broken image icon. Completely remove these side slider ads.
3. **Resolve Overlapping Pop-ups**: In the top-right corner, Monetag notifications and the Adsterra Social Bar are popping up over each other. Remove the Adsterra Social Bar pop-up script as requested.
4. **Remove "Advertisement" & "Sponsored Recommendations" Badges**: Strip out the conspicuous labels (`ADVERTISEMENT`, `SPONSORED RECOMMENDATIONS`) so ads look clean and blend naturally with the site.
5. **Restructure Output Format Cards Grid**:
   - Instead of placing ads far below at the footer, place them **directly inside and around the real output**:
     - Render the first 3 format cards (e.g., 1080p, 720p, 480p).
     - Render an in-feed ad card right between card 3 and card 4 (or a high-impact horizontal banner dividing the tiers).
     - Render the remaining format cards (e.g., 360p, 240p, MP3 Audio).
     - Render a second high-converting native ad directly beneath the final download card.
6. **Graceful Loading (No Empty Black Boxes / Broken Icons)**:
   - Remove the hardcoded dark background (`bg-slate-950/70 border border-slate-800/80`) and broken icon borders so that if an ad is loading or unfulfilled, no black hole or broken image icon is shown.

---

## 2. Detailed Technical Strategy

### A. Dynamic Hash Re-render System (`adRefreshKey`)
- **Mechanism**:
  - In `MediaStudio.jsx`, maintain an `adRefreshKey` integer state (`const [adRefreshKey, setAdRefreshKey] = useState(0)`).
  - Add a `useEffect` that listens to `activeFeature` and `hashchange` events:
    ```jsx
    useEffect(() => {
      // Whenever URL hash or platform changes (#youtubevideodownloader, #instagram, etc.)
      setAdRefreshKey((prev) => prev + 1);
    }, [activeFeature]);
    ```
  - Pass `key={`${type}-${adRefreshKey}`}` to every `<AdsterraBanner />`.
  - When the key changes, React completely unmounts the previous iframe/container and mounts a new one, triggering Adsterra's script to request a fresh creative for the new platform category.

### B. Cleaning Up Layout Collisions (`layout.jsx`)
- **Remove Left & Right Skyscraper Columns**:
  - Delete the fixed left skyscraper container (`hidden 2xl:block fixed left-3 top-28 z-20`) and the right skyscraper container. This immediately removes the black sidebar with the broken image icon.
- **Remove Adsterra Social Bar Script**:
  - Remove `<script src="https://pl28737566.profitableratecpmnetwork.com/7b/ce/44/7bce44372b81a880c31e685cb19940e4.js"></script>` from `layout.jsx`.
  - Monetag in-page push will remain the sole, clean notification system without overlapping popups.

### C. Removing "ADVERTISEMENT" and "SPONSORED" Badges (`AdsterraBanner.jsx`)
- Remove the `<span className="text-[9px] uppercase ...">Advertisement</span>` pill.
- Remove the `<span className="text-[10px] uppercase ...">Sponsored Recommendations</span>` header.
- Remove the dark background container styling (`border border-slate-800/80 bg-slate-950/70 shadow-lg`) that caused black boxes when ads were pending. Use transparent background so it renders cleanly.

### D. Re-architecting the Output Format Cards Grid (`MediaStudio.jsx`)
- When a user inspects a video, `mediaData.formats` contains the download options (typically 6 options: 1080p, 720p, 480p, 360p, 240p, MP3).
- **New Grid Layout**:
  1. **Top Row (High-Value Formats)**:
     - Render `mediaData.formats.slice(0, 3)` (1080p, 720p, 480p).
  2. **Mid-Grid Ad Slot (Directly between output tiers)**:
     - Place a responsive banner or ad card right after the 3rd card.
     - Users naturally pause here while scanning quality and file sizes, resulting in highest unintentional and intentional click conversions.
  3. **Bottom Row (Standard & Audio Formats)**:
     - Render `mediaData.formats.slice(3)` (360p, 240p, MP3 Audio).
  4. **Post-Output Action Ad Slot**:
     - Render the Native 4:1 recommendation grid (`container-7fbfd684b6cad6d0ccca08d1b524a028`) immediately below the MP3 card with a Direct Cloud Mirror Smartlink.

---

## 3. Files to Modify

| File | Changes Planned |
| :--- | :--- |
| **`frontend/app/layout.jsx`** | Remove left & right skyscraper side ads; remove Adsterra Social Bar script to prevent popup collision with Monetag. |
| **`frontend/components/AdsterraBanner.jsx`** | Remove "ADVERTISEMENT" and "SPONSORED" badges; remove black box background/borders; support `refreshKey` prop for forced re-rendering. |
| **`frontend/components/MediaStudio.jsx`** | Add `useEffect` on hash change to increment `adRefreshKey`; restructure format card output to render mid-grid ad after 3 cards and post-output ad after last card. |
| **`frontend/app/page.jsx`** | Ensure native ad below content doesn't show broken boxes. |

---

## 4. Verification & Testing Steps
1. Test switching between `#youtubevideodownloader`, `#instagram`, `#facebook`, `#tiktok` to verify all ads re-render with fresh creatives.
2. Confirm the black sidebar on the left is gone completely.
3. Confirm the top-right corner no longer has two overlapping popups.
4. Verify the format output grid displays 3 cards -> ad -> remaining cards -> post-output ad.
5. Run `npm run build` to confirm 0 compilation errors.
