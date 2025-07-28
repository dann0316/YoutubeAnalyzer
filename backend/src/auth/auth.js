"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebaseAdmin_1 = __importDefault(require("../utils/firebaseAdmin"));
const app = (0, express_1.default)();
const cors = require("cors");
const PORT = 3001;
app.use(express_1.default.json());
app.use(cors({
    origin: 'http://localhost:5173', // 프론트 주소만 허용
    credentials: true, // 필요하면 쿠키 인증 허용
}));
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // front에서 받은 정보를 Authentication의 정보를 포함해서 Firestore DB로 저장
    const { uid, nickname, password, point } = req.body;
    console.log("📦 받은 요청 body:", req.body);
    try {
        const user = yield firebaseAdmin_1.default.auth().getUser(uid);
        console.log('Firebase Auth에 저장됨 유저 이메일:', user.email);
        const userDoc = firebaseAdmin_1.default.firestore().collection('users').doc(uid);
        // 이렇게 하면 바로 실행인가?
        yield userDoc.set({
            createdAt: new Date().toISOString(), // 문자열로 저장
            email: `${user.email}`,
            nickname: `${nickname}`,
            password: `${password}`,
            role: `${user.email === "cdl2141@gmail.com" ? "admin" : "user"}`,
            point: `${user.email === "cdl2141@gmail.com" ? 1000 : 10}`,
        });
        res.status(200).json({ message: '유저 저장 완료' });
    }
    catch (error) {
        console.error('유저 조회 실패:', error.message);
        res.status(400).json({ error: '유저가 존재하지 않음' });
    }
}));
app.post('/api/user-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers['token'];
    if (!token || typeof token !== 'string') {
        res.status(401).json({ message: '토큰 전달 안됨' });
        return;
    }
    try {
        // 토큰 검증
        const decodedToken = yield firebaseAdmin_1.default.auth().verifyIdToken(token);
        // 검증된 토큰에 맞는 uid
        const uid = decodedToken.uid;
        // uid에 맞는 유저 정보 가져오기
        const userDoc = yield firebaseAdmin_1.default.firestore().collection('users').doc(uid).get();
        // .exists? 없으면 메세지
        if (!userDoc.exists) {
            res.status(404).json({ message: 'User not found' });
        }
        // 있으면 정보 front에 전달
        res.status(200).json(userDoc.data());
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid token' });
    }
}));
app.listen(PORT, () => { console.log(`서버 실행 중: ${PORT}`); });
