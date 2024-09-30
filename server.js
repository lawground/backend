const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// 라우터 설정
const authRoutes = require('./routes/authRoutes');
const easyReceiptRoutes = require('./routes/easyReceiptRoutes');
const coregRoutes = require('./routes/coregRoutes');
const realregRoutes = require('./routes/realregRoutes');
const realregReceiptRoutes = require('./routes/realregReceiptRoutes');
const lawsuitRoutes = require('./routes/lawsuitRoutes');
const lawsuitReceiptRoutes = require('./routes/lawsuitReceiptRoutes');
const eventsRoutes = require('./routes/eventsRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // 모든 도메인에서 오는 요청을 허용
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우터 사용
app.use('/api', authRoutes);
app.use('/api', easyReceiptRoutes);
app.use('/api', coregRoutes);
app.use('/api', realregRoutes);
app.use('/api', realregReceiptRoutes);
app.use('/api', lawsuitRoutes);
app.use('/api', lawsuitReceiptRoutes);
app.use('/api', eventsRoutes);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
