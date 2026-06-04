import type { ConfigContext, ExpoConfig } from "expo/config";

const IS_PROD = process.env.APP_ENV === "production";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_PROD ? "Placecard" : "Placecard Dev",
  slug: "placecard",
  version: "1.0.0",
  orientation: "portrait",
});
