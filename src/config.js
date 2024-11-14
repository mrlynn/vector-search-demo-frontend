const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3003/api'
  };
  console.log('config:', config);
  export default config;