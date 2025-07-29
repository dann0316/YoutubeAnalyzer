import { getFirestore, doc, updateDoc } from "firebase/firestore";

const db = getFirestore();

export const updateUserPoint = async (uid: string, point: number) => {
    const userDocRef = doc(db, "users", uid);

    try {
        await updateDoc(userDocRef, { point });
        console.log("Firestore에 포인트 업데이트 완료");
    } catch (error) {
        console.error("Firestore 포인트 업데이트 실패", error);
    }
};