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
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use(express_1.default.json());
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, id } = req.body;
    try {
        const user = yield firebase_admin_1.default.auth().getUser(uid);
        console.log('Firebase Auth에 이미 있는 유저:', user.email);
        // 선택: Firestore 저장 등
        // await admin.firestore().collection('users').doc(uid).set({ email });
        res.status(200).json({ message: '유저 확인 완료', email: user.email });
    }
    catch (error) {
        console.error('유저 조회 실패:', error.message);
        res.status(400).json({ error: '유저가 존재하지 않음' });
    }
}));
app.listen(PORT, () => { console.log(`서버 실행 중: ${PORT}`); });
