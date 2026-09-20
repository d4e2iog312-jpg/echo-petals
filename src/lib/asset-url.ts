type AssetReference = { url?: string };

const LOVABLE_ASSET_ORIGIN = "https://echo-petals.lovable.app";

export function assetUrl(asset: AssetReference): string {
  const url = asset.url ?? "";
  return url.startsWith("/__l5e/") ? `${LOVABLE_ASSET_ORIGIN}${url}` : url;
}
