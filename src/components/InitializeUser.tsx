'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function InitializeUser() {
    const { user } = useUser();

    useEffect(() => {
        const initUser = async () => {
            if (!user) return;

            const userRef = doc(db, "users", user.id);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Create user document with FREE plan by default
                console.log("🎉 Creating new user document for:", user.id);
                await setDoc(userRef, {
                    email: user.emailAddresses[0]?.emailAddress,
                    hasActiveMembership: false,
                    createdAt: new Date(),
                });
                console.log("✅ User document created with FREE plan");
            } else {
                // Ensure hasActiveMembership field exists
                const userData = userSnap.data();
                if (userData.hasActiveMembership === undefined) {
                    console.log("⚠️ Updating user document to include hasActiveMembership");
                    await setDoc(userRef, {
                        ...userData,
                        hasActiveMembership: false,
                    }, { merge: true });
                    console.log("✅ User document updated");
                }
            }
        };

        initUser();
    }, [user]);

    return null; // This component doesn't render anything
}
