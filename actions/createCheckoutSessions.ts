'use server';

import { auth } from "@clerk/nextjs/server";
import { adminDb } from '../firbaseAdmin';
import stripe from '@/lib/stripe';
import getBaseUrl from '@/lib/getBaseUrl';

export type UserDetails = {
    email: string;
    name: string;
};

export async function createCheckoutSession(userDetails: UserDetails) {
    await auth.protect();

    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    let stripeCustomerId: string;

    const user = await adminDb.collection("users").doc(userId).get();
    stripeCustomerId = user.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
        // Create a new Stripe customer
        const customer = await stripe.customers.create({
            email: userDetails.email,
            name: userDetails.name,
            metadata: {
                userId,
            },
        });

        await adminDb.collection("users").doc(userId).update({
            stripeCustomerId: customer.id,
        });

        stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer: stripeCustomerId,
        line_items: [
            {
                price: process.env.STRIPE_PRICE_ID,
                quantity: 1,
            },
        ],
        success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
        cancel_url: `${getBaseUrl()}/dashboard/upgrade`,
    });

    return session.id;
}
