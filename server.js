const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var path = require('path');
const history = require('connect-history-api-fallback'); // 추가된 부분

require('dotenv').config();

// 라우터 설정
const authRoutes = require('./routes/authRoutes');
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
app.use(history()); //여기


// 라우터 사용
app.use('/api', authRoutes);
app.use('/api', realregRoutes);
app.use('/api', realregReceiptRoutes);
app.use('/api', lawsuitRoutes);
app.use('/api', lawsuitReceiptRoutes);
app.use('/api', eventsRoutes);

app.use(express.static(path.join(__dirname, 'public'))); // 반드시 여기 위에 use 쓸 것!

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
