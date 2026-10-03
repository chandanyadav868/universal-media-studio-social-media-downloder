import { youtubeHandler } from "./youtubeHandler.js";
import { twitterHandler } from "./twitterHandler.js";
import { instagramHandler } from "./instagramHandler.js";
import { facebookHandler } from "./facebookHandler.js";
import { tiktokHandler } from "./tiktokHandler.js";
import { genericHandler } from "./genericHandler.js";

/**
 * Platform Strategy Registry:
 * Selects the dedicated platform handler component according to the URL.
 */
const platformHandlers = [
  youtubeHandler,
  twitterHandler,
  instagramHandler,
  facebookHandler,
  tiktokHandler,
  genericHandler // always last as fallback
];

/**
 * Finds and returns the dedicated platform handler for a given URL
 */
export function getPlatformHandler(url) {
  if (!url) return genericHandler;
  for (const handler of platformHandlers) {
    if (handler.canHandle(url)) {
      return handler;
    }
  }
  return genericHandler;
}

/**
 * Returns metadata of all supported platform engines
 */
export function getSupportedPlatformEngines() {
  return platformHandlers.map((h) => ({
    name: h.name,
    engineName: h.engineName,
    processingMethod: h.processingMethod,
  }));
}
