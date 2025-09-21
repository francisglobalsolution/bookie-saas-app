import { ConfigContext, ExpoConfig } from "@expo/config";

/** helper: pick a value per EAS profile */
function pick<T>(profile: string, map: Record<string, T>): T {
  return map[profile] ?? map.prod;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  // EAS sets this automatically on builds; default to "dev" for local runs
  const profile = process.env.EAS_BUILD_PROFILE || "dev";

  // App names per environment (shown under the icon on devices)
  const name = pick(profile, {
    dev: "Bookappily (Dev)",
    staging: "Bookappily (Staging)",
    qa: "Bookappily (QA)",
    prod: "Bookappily",
  });

  // One slug for the project across envs
  const slug = "bookie-saas-app-native";

  // Bundle IDs / App IDs per env
  const iosBundleId = pick(profile, {
    dev: "com.bookappily.app.dev",
    staging: "com.bookappily.app.staging",
    qa: "com.bookappily.app.qa",
    prod: "com.bookappily.app",
  });

  const androidPackage = iosBundleId; // mirror iOS per env

  // Shared project metadata
  const projectId = "9bc3ca10-c107-46d8-b3af-4154936acce3";
  const updatesUrl = `https://u.expo.dev/${projectId}`;

  return {
    // --- base from any existing config (kept minimal) ---
    ...config,

    // --- high-level app info ---
    name,
    slug,
    owner: "francisglobalsolution",
    scheme: "bookappily",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    // --- runtime/updates ---
    runtimeVersion: { policy: "sdkVersion" },
    updates: { url: updatesUrl },

    // --- iOS config ---
    ios: {
      supportsTablet: true,
      bundleIdentifier: iosBundleId,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    // --- Android config ---
    android: {
      package: androidPackage,
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      // NOTE: do NOT set versionCode here; EAS auto-increment handles it
    },

    // --- Web ---
    web: {
      name: "Bookappily",
      shortName: "Bookappily",
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    // --- Plugins ---
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],

    // --- Experiments ---
    experiments: { typedRoutes: true },

    // --- Extra env (pulled from EAS env at build time) ---
    extra: {
      API_URL: process.env.API_URL,
      SENTRY_DSN: process.env.SENTRY_DSN,
      USE_MOCKS: process.env.USE_MOCKS,
      eas: { projectId },
      router: {},
    },
  };
};
