import fs from "fs";

const html = fs.readFileSync("embed.html", "utf8");

// Search for EmbeddedMediaImage or img tags
const imgTags = [...html.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1].replace(/&amp;/g, "&"));
console.log("img tags in embed.html:", imgTags.length);
imgTags.forEach((src, i) => console.log(`Img [${i}]:`, src.substring(0, 120)));

// Search for display_url or media JSON
const displayUrls = [...html.matchAll(/"display_url":"([^"]+)"/g)].map(m => m[1].replace(/\\u0026/g, "&"));
console.log("display_url matches in embed:", displayUrls.length);
displayUrls.forEach((u, i) => console.log(`display_url [${i}]:`, u));

// Look for image_versions2 or candidates
const candidates = [...html.matchAll(/"candidates":(\[[^\]]+\])/g)];
console.log("candidates matches:", candidates.length);

// Look for all scontent URLs in embed
const allScontent = [...html.matchAll(/https:\\\/\\\/scontent[^\s",\\]+/g)].map(m => m[0].replace(/\\\//g, "/").replace(/\\u0026/g, "&"));
const unique = [...new Set(allScontent)];
console.log("Unique scontent in embed.html:", unique.length);
unique.forEach((u, i) => {
  if (!u.includes("s150x150") && !u.includes("profile_pic")) {
    console.log(`[${i}] ${u}`);
  }
});
