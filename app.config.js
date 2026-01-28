// export default ({ config }) => {
//   return {
//     ...config,
//     name: "Agos",            // App name
//     slug: "softdeli",            // Unique identifier for Expo
//     version: "1.0.0",
//     extra: {
//       // For local development:
//       // API_BASE_URL: "http://192.168.1.3:8080",
//       // For production:
//       API_BASE_URL: "https://agosbackend-production.up.railway.app",
//       eas: {
//         projectId: "efc88c20-e22b-4fbe-9dfd-48306b46679f"
//       }
//     },
//     android: {
//       package: "com.agos_softdeli.softdeli", // Unique Android package name
//     },
//   };
// };

export default ({ config }) => {
  return {
    ...config,
    name: "Agos",
    slug: "softdeli",
    version: "1.0.0",

    extra: {
      // For local development:
      API_BASE_URL: "http://192.168.1.6:8080",
      // For production:
      // API_BASE_URL: "https://agosbackend-production.up.railway.app",
      eas: {
        projectId: "efc88c20-e22b-4fbe-9dfd-48306b46679f",
      },
    },
    ios: {
      bundleIdentifier: "com.agossoftdeli.app",
      buildNumber: "1.0.0",
      supportsTablet: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.agos_softdeli.softdeli",
      versionCode: 1, // Android build version code
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
  };
};

