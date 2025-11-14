export default ({ config }) => {
  return {
    ...config,
    name: "Agos",            // App name
    slug: "softdeli",            // Unique identifier for Expo
    version: "1.0.0",
    extra: {
      // For local development:
      // API_BASE_URL: "http://192.168.1.3:8080",
      // For production:
      API_BASE_URL: "https://agosbackend-production.up.railway.app",
    },
    android: {
      package: "com.agos_softdeli.softdeli", // Unique Android package name
    },
  };
};
