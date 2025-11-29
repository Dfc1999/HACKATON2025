import { LogtoConfig } from "@logto/react";
import { ENV } from "./env";

export const logtoConfig: LogtoConfig = {
  endpoint: ENV.LOGTO_ENDPOINT,
  appId: ENV.LOGTO_APP_ID,
  resources: [ENV.API_BASE_URL],
  scopes: ["openid", "profile", "email"],
};