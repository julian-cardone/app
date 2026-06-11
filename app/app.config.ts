import type { ConfigContext, ExpoConfig } from "expo/config";

const APP_ENV = process.env.APP_ENV ?? "development";
const IS_PROD = APP_ENV === "production";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_PROD ? "Placecard" : "Placecard Dev",
  slug: "placecard",
  version: "1.0.0",
  orientation: "portrait",
});
