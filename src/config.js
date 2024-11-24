const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3003'
};

// Remove any trailing slashes
config.apiUrl = config.apiUrl.replace(/\/+$/, '');

export default config;