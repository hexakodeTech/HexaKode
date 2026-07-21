import { createImageUrlBuilder } from "@sanity/image-url";
import { client, isSanityConfigured } from "./sanity.client";

const builder = isSanityConfigured ? createImageUrlBuilder(client) : null;

export function urlFor(source: Parameters<ReturnType<typeof createImageUrlBuilder>["image"]>[0]) {
  if (!builder) {
    // Return a dummy object with a .url() method when Sanity is not configured
    return {
      width: () => ({ height: () => ({ url: () => "" }) }),
      height: () => ({ url: () => "" }),
      url: () => "",
    } as any;
  }
  return builder.image(source);
}
