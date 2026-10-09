# Implementation Plan: Mobile Push Ad Suppression, Native Ad Re-Positioning & Own Product Cross-Promotion

## 1. Executive Summary & Root Cause Analysis

Based on your audio recordings and screenshots:

### Issue 1: Mobile Header Covered by Stacked Pop-Up Toasts (Screenshot 1 & Audio 1)
- **Problem**: On mobile screens, two stacked push notification ads (*"Spin and Win Huge Prize!"* and *"JACKPOT WINNER OF THE DAY"*) appear pinned at the very top (`top: 0`), completely covering the `UniversalMedia` navbar, format buttons, and hamburger menu.
- **Root Cause**: The Monetag In-Page Push script (`zone: 11973493`, `tag.min.js`) dynamically creates fixed-position toast cards at the top of the viewport. On mobile devices with narrow vertical heights, two stacked toasts occupy over 150px, blinding the user from navigating.
- **Solution**:
  1. **Device-Aware Script Loading**: Modify the script loader in `layout.jsx` to only initialize In-Page Push on Desktop displays (`window.innerWidth >= 1024`). On mobile and tablet, the script will not run.
  2. **Mobile CSS Protective Barrier**: Add a mobile-specific CSS override in `globals.css` so that if any overlay toast is cached by the client browser, it is automatically suppressed on viewports `< 1024px`.

---

### Issue 2: Native Banner Too Far Down at FAQ (Screenshots 2 & 3 & Audio 2)
- **Problem**: Currently, the Native Recommendation Ad (`AdsterraBanner type="native3x1"`) is placed at the very bottom above the FAQ section. Users never scroll down that far, resulting in lost impressions and 0 clicks.
- **Solution**:
  - Shift the Native Ad up to the prime attention zone: **Directly below the Main Input Studio Component and right above "Effortless Workflow" (Step 01, 02, 03)**.
  - This ensures 100% of visitors see the native recommendation grid immediately after interacting with the URL input, dramatically multiplying click conversions.

---

### Issue 3: Cross-Promoting Your Own Product / Additional Product (Screenshot 4 & Audio 4)
- **Goal**: Like top web platforms that redirect/cross-promote their other tools (e.g., your AI Visual Studio / Background Remover in `aiapp`), you want to display an attractive promotional card to channel your downloader traffic into your other product.
- **Solution**:
  - Create a dedicated component: `OwnProductPromo.jsx` (or `FeaturedToolCard.jsx`).
  - **Design & Layout**:
    - High-CTR glassmorphic showcase card matching the Universal Media Studio dark-mode aesthetic.
    - Highlights: *"Featured Tool: AI Visual Studio & Neural Background Remover"*
    - Subtitle: *"100% In-Browser Client-Side Neural AI • Zero Cloud Uploads • Instant 4K Cutouts"*
    - Features: `Neural Cutout`, `Multi-Layer Canvas`, `GIF Animator`
    - High-intent CTA button: **"Try Free AI Studio →"** with configurable link (e.g. `NEXT_PUBLIC_AI_APP_URL` or direct link).
  - **Placements**:
    - **Position A:** Right between the Downloader and the native ads, giving users a direct path to your sister application.
    - **Position B:** Inside the format output options as an extra creative card ("Enhance or Edit Cutout with AI").

---

## 2. Step-by-Step Implementation Strategy

### Step 1: Suppress In-Page Push Overlays on Mobile & Tablet
- **Target File:** `frontend/app/layout.jsx`
  - Wrap Monetag In-Page Push in a client-side screen-width check:
    ```javascript
    // Only load floating toast ads on Desktop (>= 1024px)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      (function(s){s.dataset.zone='11973493',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
    }
    ```
- **Target File:** `frontend/app/globals.css`
  - Add responsive suppression rules for mobile and tablet:
    ```css
    @media (max-width: 1023px) {
      [class*="inpage"],
      [id*="inpage"],
      [class*="toast-banner"],
      div[style*="z-index: 2147483647"] {
        display: none !important;
      }
    }
    ```

---

### Step 2: Reposition Native Ad Above "Effortless Workflow"
- **Target File:** `frontend/app/page.jsx`
  - Remove `<AdsterraBanner type="native3x1" />` from above Section 4 (FAQ).
  - Place it directly beneath `<MediaStudio />` and above `<article>` ("Effortless Workflow"):
    ```jsx
    {/* Main Interactive Downloader Studio Component */}
    <MediaStudio />

    {/* High-CTR Native Recommendation Grid (Directly below input, above Effortless Workflow) */}
    <div className="w-full max-w-5xl mx-auto my-8">
      <AdsterraBanner type="native3x1" />
    </div>

    {/* Crawlable High-Authority Content Layer ("Effortless Workflow") */}
    <article className="w-full max-w-4xl mx-auto mt-12 sm:mt-16 pt-8 border-t border-slate-800/80">
      ...
    </article>
    ```

---

### Step 3: Build & Integrate Your Own Product Showcase Card
- **Create:** `frontend/components/OwnProductPromo.jsx`
  - Configurable destination URL (e.g., link to your AI Background Remover / Visual Studio).
  - Eye-catching banner with live glowing gradient border, badge tag (*"Sister Platform"* or *"Recommended AI Studio"*), and direct link.
- **Integrate into `frontend/app/page.jsx`:**
  - Place cleanly between the native ad and Effortless Workflow, or right below the native grid.
  - Users who finish downloading or are looking for image/video tools can click through to your AI app with 1 click.

---

## 3. Verification & Safety Checklist
1. **Mobile Header Test:** Emulate mobile screen (< 768px) and verify Monetag toasts do NOT block the header, logo, or hamburger menu.
2. **Native Ad Visibility:** Confirm that on the homepage, the Native 3:1 banner is immediately visible below the URL input box without needing to scroll to the FAQ.
3. **Cross-Promotion Clickthrough:** Verify the Own Product card renders cleanly and redirects properly to your target product.
4. **Build Verification:** Run `npm run build` to ensure zero compilation or hydration errors.
