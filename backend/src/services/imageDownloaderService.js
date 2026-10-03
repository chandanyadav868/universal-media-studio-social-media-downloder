import axios from "axios";
import { spawn, execFile } from "child_process";
import { getYtDlpPath, sanitizeMediaUrl } from "./zeroDiskStreamService.js";

/**
 * Detect image platform
 */
export function detectImagePlatform(url) {
  if (!url || typeof url !== "string") return "generic";
  const lower = url.toLowerCase();

  if (lower.includes("youtube.com/post") || lower.includes("community?lb=") || lower.includes("/community")) {
    return "youtube_post";
  }
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return "youtube_video";
  }
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("facebook.com") || lower.includes("fb.com") || lower.includes("fb.watch")) return "facebook";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "twitter";
  if (lower.includes("reddit.com") || lower.includes("redd.it")) return "reddit";
  if (lower.includes("pinterest.com") || lower.includes("pin.it")) return "pinterest";
  return "generic";
}

/**
 * Extract YouTube Video ID
 */
function extractYouTubeId(url) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  // Check shorts
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return shortsMatch[1];
  }
  return null;
}

/**
 * Fetch YouTube Video Title quickly via oEmbed or yt-dlp
 */
async function getYouTubeVideoInfo(videoId, originalUrl) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await axios.get(oembedUrl, { timeout: 4000 });
    return {
      title: res.data.title || "YouTube Video Thumbnail",
      author: res.data.author_name || "YouTube Creator",
    };
  } catch (e) {
    return {
      title: "YouTube High-Definition Thumbnail",
      author: "YouTube",
    };
  }
}

/**
 * Parse Instagram post HTML to extract uncropped original photos (from image_versions2) and carousels
 */
function parseInstagramHtmlForImages(html, postUrl) {
  const images = [];

  const titleMatch = html.match(/<title>([^<]+)<\/title>/) || html.match(/property="og:title"\s+content="([^"]+)"/);
  const rawTitle = titleMatch ? titleMatch[1].replace("• Instagram photos and videos", "").trim() : "Instagram Post";

  // Look for all image_versions2 blocks (handles both single photos and multi-image carousels!)
  const iv2Regex = /"image_versions2":\s*\{\s*"candidates":\s*(\[[^\]]+\])/g;
  const iv2Matches = [...html.matchAll(iv2Regex)];

  if (iv2Matches.length > 0) {
    iv2Matches.forEach((match, postIndex) => {
      try {
        const cleanJson = match[1]
          .replace(/\\\//g, "/")
          .replace(/\\u0026/g, "&")
          .replace(/\\u0025/g, "%");

        const candidates = JSON.parse(cleanJson);
        // Discard cropped square thumbnails (stp=c...) to preserve the original 4:5 or portrait aspect ratio
        const uncroppedCandidates = candidates.filter((c) => c.url && !c.url.includes("stp=c"));
        const bestCandidate = uncroppedCandidates.length > 0 ? uncroppedCandidates[0] : candidates[0];

        if (bestCandidate && bestCandidate.url) {
          const cleanUrl = bestCandidate.url.replace(/&amp;/g, "&");
          const width = bestCandidate.width || 1440;
          const height = bestCandidate.height || 1800;

          images.push({
            id: `ig_photo_${postIndex + 1}`,
            title: iv2Matches.length > 1
              ? `Instagram Photo #${postIndex + 1} (${width} × ${height})`
              : `Instagram Original Photo (${width} × ${height})`,
            qualityLabel: `${width}p Original (Uncropped Full Resolution)`,
            width,
            height,
            url: cleanUrl,
            isBest: postIndex === 0,
            filename: `instagram_original_${width}x${height}_${postIndex + 1}.jpg`,
          });
        }
      } catch (err) {
        console.warn("[Instagram] Candidates parse error:", err.message);
      }
    });
  }

  // Fallback to og:image if image_versions2 was absent
  if (images.length === 0) {
    const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/) || html.match(/content="([^"]+)"\s+property="og:image"/);
    if (ogMatch && ogMatch[1]) {
      const cleanImgUrl = ogMatch[1].replace(/&amp;/g, "&").replace(/\\u0026/g, "&");
      images.push({
        id: "ig_photo_og",
        title: "Instagram Photo",
        qualityLabel: "Original High Quality",
        url: cleanImgUrl,
        isBest: true,
        filename: "instagram_photo.jpg",
      });
    }
  }

  if (images.length === 0) {
    return null;
  }

  return {
    platform: "instagram",
    type: "post",
    title: rawTitle || "Instagram Photo",
    author: rawTitle.split("on Instagram")[0]?.trim() || "Instagram Creator",
    originalUrl: postUrl,
    count: images.length,
    primaryPreview: images[0]?.url,
    images,
    note: images.length > 1
      ? `Extracted ${images.length} full-resolution uncropped carousel photos from Instagram.`
      : "Extracted 100% full-resolution uncropped original photo from Instagram (no square cropping).",
  };
}

/**
 * Inspect Media Images from URL (YouTube thumbnails, Community Posts, Instagram, Facebook, X.com)
 */
export async function inspectMediaImages(rawUrl) {
  const url = sanitizeMediaUrl(rawUrl);
  const platform = detectImagePlatform(url);

  // 1. YouTube Video URL (Thumbnails)
  if (platform === "youtube_video") {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      throw new Error("Could not extract a valid YouTube video ID from the provided URL.");
    }

    const info = await getYouTubeVideoInfo(videoId, url);
    const images = [
      {
        id: "maxres",
        title: "Maximum Resolution UHD (1080p)",
        qualityLabel: "Full HD 1080p (Best Quality)",
        width: 1920,
        height: 1080,
        url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        isBest: true,
        filename: `${videoId}_1080p_thumbnail.jpg`
      },
      {
        id: "hq720",
        title: "High Definition 720p",
        qualityLabel: "HD 720p",
        width: 1280,
        height: 720,
        url: `https://img.youtube.com/vi/${videoId}/hq720.jpg`,
        isBest: false,
        filename: `${videoId}_720p_thumbnail.jpg`
      },
      {
        id: "sd",
        title: "Standard Definition 480p",
        qualityLabel: "SD 480p",
        width: 640,
        height: 480,
        url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        isBest: false,
        filename: `${videoId}_480p_thumbnail.jpg`
      }
    ];

    return {
      platform: "youtube",
      type: "thumbnail",
      title: info.title,
      author: info.author,
      originalUrl: url,
      count: images.length,
      primaryPreview: images[0].url,
      images,
      note: "Showing highest quality 1080p thumbnail available from YouTube."
    };
  }

  // 2. YouTube Community Post URL
  if (platform === "youtube_post") {
    try {
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1"
        },
        timeout: 15000,
      });

      const html = res.data;
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      const postTitle = titleMatch ? titleMatch[1].replace(" - YouTube", "") : "YouTube Community Post";

      // Extract all ggpht image URLs from post
      const rawUrls = [...html.matchAll(/https:\/\/yt3\.ggpht\.com\/[a-zA-Z0-9_\-\/]+/g)].map(m => m[0]);
      
      // Filter out small avatars and deduplicate base URLs
      const filtered = rawUrls.filter(u => 
        !u.includes("=s88") && 
        !u.includes("=s48") && 
        !u.includes("=s32") && 
        !u.includes("=s68") && 
        !u.includes("=s176")
      );

      const uniqueBase = [...new Set(filtered.map(u => u.split("=")[0]))];

      const images = [];

      // If specific ggpht images found, format them to full uncompressed original size (=s0)
      if (uniqueBase.length > 0) {
        uniqueBase.forEach((baseUrl, index) => {
          images.push({
            id: `post_img_${index + 1}`,
            title: `Community Post Photo #${index + 1}`,
            qualityLabel: "Original High-Res Photo",
            url: `${baseUrl}=s0`, // =s0 delivers full uncompressed original resolution!
            isBest: true,
            filename: `youtube_community_post_${index + 1}.jpg`
          });
        });
      } else {
        // Fallback to og:image if present
        const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogMatch && ogMatch[1]) {
          images.push({
            id: "post_img_og",
            title: "Community Post Photo",
            qualityLabel: "Original High-Res Photo",
            url: ogMatch[1].replace(/=s\d+/, "=s0"),
            isBest: true,
            filename: "youtube_community_post.jpg"
          });
        }
      }

      if (images.length === 0) {
        throw new Error("No images found in this YouTube Community Post.");
      }

      return {
        platform: "youtube",
        type: "community_post",
        title: postTitle,
        author: postTitle.split(" - ")[0] || "YouTube Creator",
        originalUrl: url,
        count: images.length,
        primaryPreview: images[0].url,
        images,
        note: `Extracted ${images.length} high-resolution image(s) from YouTube Community Post.`
      };
    } catch (err) {
      throw new Error(`Failed to extract YouTube Community Post: ${err.message}`);
    }
  }

  // 3. Twitter / X.com Post
  if (platform === "twitter") {
    const tweetIdMatch = url.match(/status\/(\d+)/);
    if (!tweetIdMatch) {
      throw new Error("Could not find a valid Tweet/X post ID in the URL.");
    }
    const tweetId = tweetIdMatch[1];

    try {
      // Use public fast syndication / fixupx API for Twitter media extraction
      const apiRes = await axios.get(`https://api.fxtwitter.com/i/status/${tweetId}`, {
        headers: { "User-Agent": "UniversalMediaStudio/1.0" },
        timeout: 8000
      }).catch(async () => {
        return await axios.get(`https://api.vxtwitter.com/Twitter/status/${tweetId}`, { timeout: 8000 });
      });

      const tweetData = apiRes.data.tweet || apiRes.data;
      const photos = tweetData.media?.photos || tweetData.media?.all?.filter(m => m.type === "photo") || [];

      const images = [];
      if (photos.length > 0) {
        photos.forEach((p, idx) => {
          const rawUrl = p.url || p;
          // Upgrade to original quality
          const origUrl = rawUrl.includes("?") 
            ? rawUrl.replace(/name=[^&]+/, "name=orig") 
            : `${rawUrl}?format=jpg&name=orig`;

          images.push({
            id: `x_photo_${idx + 1}`,
            title: `X / Twitter Photo #${idx + 1}`,
            qualityLabel: "Original Quality (UHD)",
            width: p.width || 2048,
            height: p.height || 1536,
            url: origUrl,
            isBest: true,
            filename: `x_post_${tweetId}_${idx + 1}.jpg`
          });
        });
      } else if (tweetData.thumbnail_url || tweetData.media_url) {
        images.push({
          id: "x_photo_single",
          title: "X / Twitter Photo",
          qualityLabel: "Original Quality (UHD)",
          url: tweetData.thumbnail_url || tweetData.media_url,
          isBest: true,
          filename: `x_post_${tweetId}.jpg`
        });
      }

      if (images.length === 0) {
        throw new Error("No images found in this X / Twitter post.");
      }

      return {
        platform: "twitter",
        type: "post",
        title: tweetData.text || "X / Twitter Post",
        author: tweetData.author?.name ? `${tweetData.author.name} (@${tweetData.author.screen_name})` : "X User",
        originalUrl: url,
        count: images.length,
        primaryPreview: images[0].url,
        images,
        note: `Extracted ${images.length} original full-resolution photo(s) from X.com.`
      };
    } catch (err) {
      throw new Error(`Failed to inspect X.com post: ${err.message}`);
    }
  }

  // 4. Instagram Post (Photos & Carousels)
  if (platform === "instagram") {
    // Strategy 1: Fetch with Chrome Navigation Headers for full uncropped image_versions2
    try {
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1"
        },
        timeout: 10000,
        maxRedirects: 5,
      });

      const html = typeof res.data === "string" ? res.data : "";
      const parsed = parseInstagramHtmlForImages(html, url);
      if (parsed) return parsed;
    } catch (chromeErr) {
      console.warn("[Instagram] Chrome headers failed, trying Meta crawler...", chromeErr.message);
    }

    // Strategy 2: Direct fetch with facebookexternalhit
    try {
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 10000,
        maxRedirects: 5,
      });

      const html = typeof res.data === "string" ? res.data : "";
      const parsed = parseInstagramHtmlForImages(html, url);
      if (parsed) return parsed;
    } catch (crawlerErr) {
      console.warn("[Instagram] Crawler strategy failed, trying embed fallback...", crawlerErr.message);
    }

    // Strategy 3: Embed Iframe Fallback
    try {
      const shortcodeMatch = url.match(/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
      const shortcode = shortcodeMatch ? shortcodeMatch[1] : null;
      const embedUrl = shortcode 
        ? `https://www.instagram.com/p/${shortcode}/embed/captioned/`
        : url;

      const res = await axios.get(embedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        },
        timeout: 8000
      });

      const ogMatch = res.data.match(/display_url":"([^"]+)"/) || res.data.match(/<meta property="og:image" content="([^"]+)"/);
      if (ogMatch && ogMatch[1]) {
        const cleanImgUrl = ogMatch[1].replace(/\\u0026/g, "&").replace(/&amp;/g, "&");
        return {
          platform: "instagram",
          type: "post",
          title: "Instagram Photo",
          author: "Instagram User",
          originalUrl: url,
          count: 1,
          primaryPreview: cleanImgUrl,
          images: [
            {
              id: "ig_embed_img",
              title: "Instagram Photo",
              qualityLabel: "Original Quality",
              url: cleanImgUrl,
              isBest: true,
              filename: "instagram_photo.jpg"
            }
          ],
          note: "Extracted full-resolution Instagram photo via embed endpoint."
        };
      }
    } catch (embedErr) {}

    // Strategy 4: yt-dlp fallback
    try {
      const ytdlp = getYtDlpPath();
      const infoStr = await new Promise((resolve, reject) => {
        execFile(ytdlp, ["--dump-single-json", "--no-warnings", "--skip-download", url], { timeout: 15000, maxBuffer: 1024 * 1024 * 20 }, (error, stdout, stderr) => {
          if (error) return reject(new Error(stderr || error.message));
          resolve(stdout);
        });
      });

      const info = JSON.parse(infoStr);
      if (info.thumbnail) {
        return {
          platform: "instagram",
          type: "post",
          title: info.title || "Instagram Post",
          author: info.uploader || "Instagram User",
          originalUrl: url,
          count: 1,
          primaryPreview: info.thumbnail,
          images: [
            {
              id: "ig_photo_ytdlp",
              title: "Instagram High-Res Photo",
              qualityLabel: "Original Quality (HD)",
              url: info.thumbnail,
              isBest: true,
              filename: `instagram_${info.id || "post"}.jpg`
            }
          ],
          note: "Extracted high-definition Instagram photo."
        };
      }
    } catch (ytdlpErr) {}

    throw new Error("Unable to extract Instagram photo. Please ensure the post is public and not restricted.");
  }

  // 5. Facebook Post / Photo
  if (platform === "facebook") {
    try {
      const ytdlp = getYtDlpPath();
      const infoStr = await new Promise((resolve) => {
        execFile(ytdlp, ["--dump-single-json", "--no-warnings", "--skip-download", url], { timeout: 15000, maxBuffer: 1024 * 1024 * 20 }, (error, stdout) => {
          if (error) return resolve(null);
          resolve(stdout);
        });
      });

      if (infoStr) {
        const info = JSON.parse(infoStr);
        if (info.thumbnail) {
          return {
            platform: "facebook",
            type: "post",
            title: info.title || "Facebook Photo",
            author: info.uploader || "Facebook User",
            originalUrl: url,
            count: 1,
            primaryPreview: info.thumbnail,
            images: [
              {
                id: "fb_img_1",
                title: "Facebook High-Res Photo",
                qualityLabel: "Full Resolution",
                url: info.thumbnail,
                isBest: true,
                filename: `facebook_${info.id || "photo"}.jpg`
              }
            ],
            note: "Extracted high-resolution Facebook photo asset."
          };
        }
      }

      // Fallback scrape using mobile and externalhit headers
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        maxRedirects: 5,
        timeout: 10000
      });
      const ogMatch = res.data.match(/property="og:image"\s+content="([^"]+)"/) || res.data.match(/content="([^"]+)"\s+property="og:image"/);
      if (ogMatch && ogMatch[1]) {
        const cleanImgUrl = ogMatch[1].replace(/&amp;/g, "&");
        return {
          platform: "facebook",
          type: "post",
          title: "Facebook Photo",
          author: "Facebook User",
          originalUrl: url,
          count: 1,
          primaryPreview: cleanImgUrl,
          images: [
            {
              id: "fb_og",
              title: "Facebook High-Res Photo",
              qualityLabel: "Full Resolution",
              url: cleanImgUrl,
              isBest: true,
              filename: "facebook_photo.jpg"
            }
          ],
          note: "Extracted high-resolution Facebook photo asset."
        };
      }
      throw new Error("Unable to extract Facebook photo. Please verify the post is from a public page or profile.");
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("404") || msg.includes("400") || msg.includes("login")) {
        throw new Error("This Facebook post/photo is private, requires login, or has been removed.");
      }
      throw new Error(`Facebook extraction: ${msg}`);
    }
  }

  // 6. Generic Image URL or Web Page
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      timeout: 8000
    });

    const contentType = res.headers["content-type"] || "";
    if (contentType.startsWith("image/")) {
      return {
        platform: "generic",
        type: "image",
        title: "Direct Image",
        author: "Web",
        originalUrl: url,
        count: 1,
        primaryPreview: url,
        images: [
          {
            id: "direct_img",
            title: "Original Image",
            qualityLabel: "Direct Source Quality",
            url,
            isBest: true,
            filename: "downloaded_image.jpg"
          }
        ],
        note: "Direct high-resolution image source."
      };
    }

    // Check og:image in page HTML
    const ogMatch = res.data.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogMatch && ogMatch[1]) {
      return {
        platform: "generic",
        type: "web",
        title: "Extracted Page Image",
        author: "Web",
        originalUrl: url,
        count: 1,
        primaryPreview: ogMatch[1],
        images: [
          {
            id: "web_og",
            title: "Full Resolution Image",
            qualityLabel: "Original High-Res Asset",
            url: ogMatch[1],
            isBest: true,
            filename: "extracted_image.jpg"
          }
        ],
        note: "Extracted high-resolution image asset from webpage."
      };
    }

    throw new Error("No image could be detected at the specified URL.");
  } catch (e) {
    throw new Error(`Failed to extract image: ${e.message}`);
  }
}

/**
 * PROXY IN-MEMORY IMAGE STREAMING:
 * Streams image binary from target CDN directly into the user's browser download
 * Bypasses CORS completely and avoids storing anything to the VPS disk!
 */
export async function proxyImageStream(imageUrl, filename, res, isInline = false) {
  try {
    const lowerUrl = (imageUrl || "").toLowerCase();
    const reqHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    };

    // Platform-specific bypass headers
    if (lowerUrl.includes("instagram") || lowerUrl.includes("cdninstagram.com")) {
      reqHeaders["Referer"] = "https://www.instagram.com/";
      reqHeaders["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
    } else if (lowerUrl.includes("lookaside.fbsbx.com") || lowerUrl.includes("facebook.com") || lowerUrl.includes("fbcdn.net")) {
      reqHeaders["User-Agent"] = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
      reqHeaders["Referer"] = "https://www.facebook.com/";
    } else if (lowerUrl.includes("yt3.ggpht.com") || lowerUrl.includes("youtube.com") || lowerUrl.includes("googleusercontent.com")) {
      reqHeaders["Referer"] = "https://www.youtube.com/";
    }

    const response = await axios({
      method: "GET",
      url: imageUrl,
      responseType: "stream",
      headers: reqHeaders,
      timeout: 15000,
    });

    const cleanFilename = (filename || "image.jpg")
      .replace(/[^\w\s.-]/gi, "")
      .replace(/\s+/g, "_");

    let contentType = response.headers["content-type"] || "image/jpeg";
    if (contentType.includes("text/html") && (lowerUrl.includes(".jpg") || lowerUrl.includes(".jpeg"))) {
      contentType = "image/jpeg";
    }

    if (isInline) {
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Cache-Control", "public, max-age=86400");
    } else {
      res.setHeader("Content-Disposition", `attachment; filename="${cleanFilename}"`);
    }
    
    res.setHeader("Content-Type", contentType);
    response.data.pipe(res);
  } catch (err) {
    console.error("[ImageProxy] Streaming error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: "Failed to download image asset." });
    }
  }
}
