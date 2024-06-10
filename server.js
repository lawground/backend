const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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

// History API fallback을 사용하도록 설정 (라우터 설정 이전에 사용)
app.use(history());

// 라우터 사용
app.use('/api', authRoutes);
app.use('/api', realregRoutes);
app.use('/api', realregReceiptRoutes);
app.use('/api', lawsuitRoutes);
app.use('/api', lawsuitReceiptRoutes);
app.use('/api', eventsRoutes);

// 정적 파일 서빙 (build 폴더를 프론트엔드 빌드 출력 디렉토리로 변경)
app.use(express.static('build'));

// catch-all route to serve index.html (SPA의 엔트리 포인트로 사용)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
