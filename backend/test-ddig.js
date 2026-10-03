import axios from "axios";

async function testDDInstagram() {
  const shortcode = "Ddt7Zc_C9-q";
  try {
    const res = await axios.get(`https://ddinstagram.com/p/${shortcode}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 8000
    });
    console.log("ddinstagram status:", res.status, "HTML length:", res.data.length);
    const og = res.data.match(/property="og:image"\s+content="([^"]+)"/) || res.data.match(/content="([^"]+)"\s+property="og:image"/);
    console.log("OG Image:", og ? og[1] : "None");
    const video = res.data.match(/property="og:video"\s+content="([^"]+)"/) || res.data.match(/content="([^"]+)"\s+property="og:video"/);
    console.log("OG Video:", video ? video[1] : "None");
  } catch (e) {
    console.log("ddinstagram error:", e.message);
  }
}

testDDInstagram();
