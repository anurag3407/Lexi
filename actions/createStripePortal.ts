'use server';

import { auth } from "@clerk/nextjs/server";
import { adminDb } from '../firbaseAdmin';
import stripe from '@/lib/stripe';
import getBaseUrl from '@/lib/getBaseUrl';

export async function createStripePortal() {
    await auth.protect();

    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    // Get customer id from Firestore
    const user = await adminDb.collection("users").doc(userId).get();
    const stripeCustomerId = user.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
        throw new Error("Stripe customer ID not found");
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${getBaseUrl()}/dashboard`,
    });

    return portalSession.url;
}
