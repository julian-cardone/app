export const APP_ENV = process.env.APP_ENV ?? "development";

export const IS_PROD = APP_ENV === "production";
