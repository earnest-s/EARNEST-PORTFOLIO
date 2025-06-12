const express = require('express');
const path = require('path');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory for views (EJS templates)
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "Public" directory
app.use(express.static(path.join(__dirname, 'Public')));

// Routes
app.get('/', (req, res) => {
  res.render('index'); // Will render views/index.ejs
});

app.get('/thank-you', (req, res) => {
  res.render('thank-you'); // Will render views/thank-you.ejs
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
