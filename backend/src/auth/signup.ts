import express, { Request, Response } from 'express';
import admin from '../utils/firebaseAdmin';

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
    email: string;
    nickname: string;
}

app.post('/api/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const { uid, email, nickname } = req.body;
    console.log("📦 받은 요청 body:", req.body);

    try {
        const user = await admin.auth().getUser(uid);
        console.log('Firebase Auth에 저장됨 유저 이메일:', user.email);

        const userDoc = admin.firestore().collection('users').doc('savedUser');
        
        // 이렇게 하면 바로 실행인가?
        await userDoc.set({
            createdAt: new Date().toISOString(), // 문자열로 저장
            email: `${user.email}`,
            nickname: `${nickname}`, // Timestamp 객체로 저장
            point: 0,
            role: `${user.email === "cdl2141@gmail.com" ? "admin" : "user"}`,
            uid: `${uid}`,
        });

        res.status(200).json({ message: '유저 저장 완료', email: user.email });
    } catch (error: any) {
        console.error('유저 조회 실패:', error.message);
        res.status(400).json({ error: '유저가 존재하지 않음' });
    }
});

app.listen(PORT, () => { console.log(`서버 실행 중: ${PORT}`) });
