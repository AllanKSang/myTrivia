const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy middleware for CORS handling
app.use(
    '/proxy',
    createProxyMiddleware({
        target: 'https://opentdb.com',
        changeOrigin: true,
        pathRewrite: {
            '^/proxy': '', // Remove the /proxy prefix when forwarding the request
        },
    })
);

// Serve your React app (adjust the path accordingly)
app.use(express.static('build'));

// Start the server
const PORT = process.env.PORT || 3001; // Use the provided PORT or default to 3001
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});