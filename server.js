const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const lawsuitRoutes = require('./routes/lawsuitRoutes');
const receiptRoutes = require('./routes/receiptRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api', lawsuitRoutes);
app.use('/api', receiptRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
