import express, { Request, Response } from 'express';
import admin from '../utils/firebaseAdmin';

const app = express();
const cors = require("cors");
const PORT = 3001;
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // 프론트 주소만 허용
    credentials: true,               // 필요하면 쿠키 인증 허용
}));

interface RegisterRequestBody {
    uid: string;
    email: string;
    nickname: string;
    password: string;
    point:number;
}

app.post('/api/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {

    // front에서 받은 정보를 Authentication의 정보를 포함해서 Firestore DB로 저장
    const { uid, nickname, password, point } = req.body;
    console.log("📦 받은 요청 body:", req.body);

    try {
        const user = await admin.auth().getUser(uid);
        console.log('Firebase Auth에 저장됨 유저 이메일:', user.email);

        const userDoc = admin.firestore().collection('users').doc(uid);

        // 이렇게 하면 바로 실행인가?
        await userDoc.set({
            createdAt: new Date().toISOString(), // 문자열로 저장
            email: `${user.email}`,
            nickname: `${nickname}`,
            password: `${password}`,
            role: `${user.email === "cdl2141@gmail.com" ? "admin" : "user"}`,
            point: `${user.email === "cdl2141@gmail.com" ? 1000 : 10}`,
        });

        res.status(200).json({ message: '유저 저장 완료' });

    } catch (error: any) {
        console.error('유저 조회 실패:', error.message);
        res.status(400).json({ error: '유저가 존재하지 않음' });
    }
});

app.post('/api/user-data', async (req: Request, res: Response): Promise<void> => {
    const token = req.headers['token'];

    if (!token || typeof token !== 'string') {
        res.status(401).json({ message: '토큰 전달 안됨' });
        return;
    }

    try {
        // 토큰 검증
        const decodedToken = await admin.auth().verifyIdToken(token);
        // 검증된 토큰에 맞는 uid
        const uid = decodedToken.uid;
        // uid에 맞는 유저 정보 가져오기
        const userDoc = await admin.firestore().collection('users').doc(uid).get();

        // .exists? 없으면 메세지
        if (!userDoc.exists) {
            res.status(404).json({ message: 'User not found' });
        }
        
        // 있으면 정보 front에 전달
        res.status(200).json(userDoc.data());
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.listen(PORT, () => { console.log(`서버 실행 중: ${PORT}`) });
