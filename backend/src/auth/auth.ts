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
    point: number;
}

app.post('/api/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {

    // front에서 받은 정보를 Authentication의 정보를 포함해서 Firestore DB로 저장
    const { uid, nickname, password, point } = req.body;
    console.log("받은 요청 body:", req.body);

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

app.post('/api/videos', async (req: Request, res: Response): Promise<void> => {
    const token = req.headers['token'];
    const newVideos = req.body; // 새로 들어온 영상 배열

    if (!token || typeof token !== 'string') {
        res.status(401).json({ message: '토큰 전달 안됨' });
        return;
    }

    try {
        // 토큰 검증
        const decodedToken = await admin.auth().verifyIdToken(token);
        // 검증된 토큰의 uid과 일치된 uid
        const uid = decodedToken.uid;
        // Firestore에서 document의 reference(참조) 생성
        const userVideoDocRef = admin.firestore().collection('videos').doc(`videos_${uid}`);
        // 실제로 Firesotre에서 해당 문서의 데이터 읽고 데이터의 딱 지금 Snapshot 객체 반환
        const docSnapshot = await userVideoDocRef.get();
        // 예시: docSnapshot 객체의 구조 (일부 생략)
        //         {
        //             exists: true,
        //                 id: 'videos_abc123',
        //                     ref: DocumentReference {
        //                 id: 'videos_abc123',
        //                     parent: CollectionReference { ... },
        //     firestore: Firestore { ... }
        //   },
        //     metadata: { ... },
        //     createTime: Timestamp,
        //     updateTime: Timestamp,
        //     readTime: Timestamp,
        //     data(): {
        //     videos: [
        //         { id: 'vid1', title: 'Video 1', ... },
        //         { id: 'vid2', title: 'Video 2', ... }
        //     ]
        // }
        // }

        // 기존 videos 빈배열
        let existingVideos: any[] = [];

        // docSanpShot에 뭐라도 있으면 Snapshot 객체 안에 데이터 넣고 그 데이터 안에 videos 빈배열에 넣기
        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            existingVideos = data?.videos || [];
        }

        // 기존 videoId 목록 집합 자료구조로 중복 제거
        const existingIds = new Set(existingVideos.map((a: any) => a.videoId));

        // 중복되지 않는 새 영상만 필터링
        const uniqueNewVideos = newVideos.filter((a: any) => !existingIds.has(a.videoId));

        if (uniqueNewVideos.length === 0) {
            res.status(200).json({ message: '중복된 영상이므로 추가할 게 없음' });
        }

        // 기존 + 새 영상 합치기
        const updatedVideos = [...existingVideos, ...uniqueNewVideos];

        // 병합 저장
        await userVideoDocRef.set(
            { videos: updatedVideos },
            { merge: true }
        );

        res.status(200).json({ message: `${uniqueNewVideos.length}개의 새로운 영상 추가 완료` });

    } catch (error: any) {
        console.error('영상 수집 실패:', error.message);
        res.status(400).json({ error: '영상 수집 실패' });
    }
});

app.post('/api/videosinfo', async (req: Request, res: Response) => {
    const token = req.headers['token'];

    if (!token || typeof token !== 'string') {
        res.status(401).json({ message: '토큰 전달 안됨' });
        return;
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        const userVideoDocRef = admin.firestore().collection('videos').doc(`videos_${uid}`);
        const docSnapshot = await userVideoDocRef.get();

        if (!docSnapshot.exists) {
            res.status(404).json({ message: '영상 정보가 없습니다' });
            return;
        }

        const videoData = docSnapshot.data();
        res.status(200).json({ videos: videoData?.videos || [] });
    } catch (error: any) {
        console.error('영상 정보 조회 실패:', error.message);
        res.status(400).json({ message: '영상 정보 조회 실패' });
    }
});

app.post('/api/delete-video', async (req: Request, res: Response): Promise<void> => {
    const token = req.headers['token'];
    const { videoId } = req.body;

    if (!token || typeof token !== 'string') {
        res.status(401).json({ error: '토큰이 없습니다.' });
        return;
    }

    if (!videoId) {
        res.status(400).json({ error: '삭제할 videoId가 필요합니다.' });
        return;
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        const userVideoDocRef = admin.firestore().collection('videos').doc(`videos_${uid}`);
        const doc = await userVideoDocRef.get();

        if (!doc.exists) {
            res.status(404).json({ error: '해당 유저의 영상 정보가 없습니다.' });
            return;
        }

        const data = doc.data();
        const existingVideos = data?.videos || [];

        // videoId로 영상 필터링
        const updatedVideos = existingVideos.filter((v: any) => v.id !== videoId);

        await userVideoDocRef.update({ videos: updatedVideos });

        res.status(200).json({ message: '영상 삭제 성공' });
    } catch (error: any) {
        console.error("영상 삭제 실패:", error.message);
        res.status(500).json({ error: '서버 에러' });
    }
});


app.listen(PORT, () => { console.log(`서버 실행 중: ${PORT}`) });
