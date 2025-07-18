import express, { Request, Response } from 'express';
import admin from 'firebase-admin';

const app = express();
const cors = require("cors");
const PORT = 3001;
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', // 프론트 주소만 허용
  credentials: true,               // 필요하면 쿠키 인증 허용
}));

interface RegisterRequestBody {
    uid: string;
    id: string;
}

app.post('/api/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const { uid, id } = req.body;

    try {
        const user = await admin.auth().getUser(uid);
        console.log('Firebase Auth에 이미 있는 유저:', user.email);

        // 선택: Firestore 저장 등
        // await admin.firestore().collection('users').doc(uid).set({ email });

        res.status(200).json({ message: '유저 확인 완료', email: user.email });
    } catch (error: any) {
        console.error('유저 조회 실패:', error.message);
        res.status(400).json({ error: '유저가 존재하지 않음' });
    }
});

app.listen(PORT, () => { console.log(`서버 실행 중: ${PORT}`) });
