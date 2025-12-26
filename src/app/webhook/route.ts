import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { adminDb } from "../../../firbaseAdmin";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const body = await request.text();
  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("Stripe webhook secret is not set");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  const getUserDetails = async (customerId: string) => {
    const userDoc = await adminDb
      .collection("stripe_customers")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

    if (!userDoc.empty) {
      return userDoc.docs[0];
    }
    return null;
  };

  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const userDetails = await getUserDetails(customerId);

      if (!userDetails?.id) {
        console.log("User not found for customer ID:", customerId);
        return new NextResponse("User not found", { status: 404 });
      }

      // Update user's subscription status in Firestore
      await adminDb.collection("users").doc(userDetails.id).update({
        hasActiveMembership: true,
      });

      break;
    }
    case "customer.subscription.deleted":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Check if subscription is canceled or expired
      if (subscription.status === "canceled" || subscription.status === "unpaid") {
        const subCustomerId = subscription.customer as string;

        const subUserDetails = await getUserDetails(subCustomerId);

        if (!subUserDetails?.id) {
          console.log("User not found for customer ID:", subCustomerId);
          return new NextResponse("User not found", { status: 404 });
        }

        // Update user's subscription status in Firestore
        await adminDb.collection("users").doc(subUserDetails.id).update({
          hasActiveMembership: false,
        });
      }

      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
