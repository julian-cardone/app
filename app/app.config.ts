import type { ConfigContext, ExpoConfig } from "expo/config";

import { IS_PROD } from "@/config/env";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_PROD ? "Placecard" : "Placecard Dev",
  slug: "placecard",
  version: "1.0.0",
  orientation: "portrait",
});
