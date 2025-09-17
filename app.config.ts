import { ConfigContext, ExpoConfig } from "@expo/config";

function pick<T>(profile: string, map: Record<string, T>): T {
  return map[profile] ?? map.prod;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const profile = process.env.EAS_BUILD_PROFILE || "dev";

  const name = pick(profile, {
    dev: "Bookie (Dev)",
    staging: "Bookie (Staging)",
    qa: "Bookie (QA)",
    prod: "Bookie",
  });

  const slug = "bookie-saas-app-native";

  const iosBundleId = pick(profile, {
    dev: "com.bookie.app.dev",
    staging: "com.bookie.app.staging",
    qa: "com.bookie.app.qa",
    prod: "com.bookie.app",
  });

  const androidPackage = iosBundleId;

  const channel = pick(profile, {
    dev: "dev",
    staging: "staging",
    qa: "qa",
    prod: "prod",
  });

  return {
    ...config,
    name,
    slug,
    scheme: "bookie",
    runtimeVersion: { policy: "sdkVersion" },
    updates: {
      url: "https://u.expo.dev/9bc3ca10-c107-46d8-b3af-4154936acce3",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: iosBundleId,
    },
    android: {
      package: androidPackage,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    extra: {
      API_URL: process.env.API_URL,
      SENTRY_DSN: process.env.SENTRY_DSN,
      USE_MOCKS: process.env.USE_MOCKS,
      eas: { projectId: "9bc3ca10-c107-46d8-b3af-4154936acce3" },
    },
    // ...existing code...
  };
};
