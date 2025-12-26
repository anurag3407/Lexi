'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { doc, collection } from "firebase/firestore";

export const PRO_LIMIT = 20;
export const FREE_LIMIT = 2;

function useSubscription() {
    const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
    const [isOverFileLimit, setIsOverFileLimit] = useState(false);
    const { user } = useUser();

    const [snapshot, loading, error] = useDocument(
        user ? doc(db, "users", user.id) : null,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [filesSnapshot, filesLoading] = useCollection(
        user ? collection(db, "users", user.id, "files") : null
    );

    useEffect(() => {
        if (!snapshot) return;

        const data = snapshot.data();
        
        // If no user document exists or hasActiveMembership is undefined, default to false (FREE plan)
        const membershipStatus = data?.hasActiveMembership ?? false;
        
        console.log("👤 User subscription data:", {
            exists: snapshot.exists,
            hasActiveMembership: membershipStatus,
            rawData: data
        });

        setHasActiveMembership(membershipStatus);
    }, [snapshot]);

    useEffect(() => {
        if (!filesSnapshot) return;
        
        // Default to false (FREE plan) if hasActiveMembership is null
        const isPro = hasActiveMembership ?? false;
        const files = filesSnapshot.docs;
        const usersLimit = isPro ? PRO_LIMIT : FREE_LIMIT;

        console.log(
            "🔍 File Limit Check:",
            "\n  Current files:", files.length,
            "\n  User limit:", usersLimit,
            "\n  Is PRO:", isPro,
            "\n  Is over limit:", files.length >= usersLimit
        );

        setIsOverFileLimit(files.length >= usersLimit);
    }, [filesSnapshot, hasActiveMembership]);

    return {
        hasActiveMembership,
        loading,
        error,
        filesLoading,
        isOverFileLimit,
    };
}

export { useSubscription };
export default useSubscription;
