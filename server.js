const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

// Serve static files from dist/public directory
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});