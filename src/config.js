// Frontend: src/config.js
const configs = {
  development: {
    apiUrl: 'http://localhost:3003/api',
  },
  production: {
    apiUrl: 'https://vector-search-demo-backend.vercel.app/api',
  }
};

const environment = import.meta.env.MODE || 'development';
const config = configs[environment];

// Remove any trailing slashes
config.apiUrl = config.apiUrl.replace(/\/+$/, '');

export default config;