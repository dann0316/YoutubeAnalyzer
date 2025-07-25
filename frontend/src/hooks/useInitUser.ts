import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useUserStore } from "@/stores/store";

export const useInitUser = () => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();

                const res = await fetch("http://localhost:3001/api/user-data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token,
                    },
                });

                const { nickname, point, role } = await res.json();

                useUserStore.getState().setUser({
                    uid: user.uid,
                    email: user.email ?? "",
                    nickname,
                    point,
                    role,
                });
            } else {
                useUserStore.getState().clearUser();
            }
        });

        return () => unsubscribe();
    }, []);
};
