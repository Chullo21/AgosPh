// src/services/Discovery.js
const getApiBaseUrl = () => {
  const host = window.location.hostname;
  const port = 5001;

  if (host === "localhost" || host.startsWith("192.168.")) {
    return `http://${host}:${port}/api`;
  }

  return `https://your-prod-domain.com/api`;
};

const Discovery = {
  apiUrl: getApiBaseUrl(),
};

export default Discovery;
