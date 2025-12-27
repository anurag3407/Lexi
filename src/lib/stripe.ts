import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_API_KEY;

// Allow build to succeed without Stripe configured (for "Coming Soon" mode)
let stripe: Stripe;

if (!stripeSecretKey) {
  console.warn("⚠️  Stripe secret key not configured - payment features disabled");
  // Return a mock stripe object that won't be used
  stripe = {
    webhooks: {
      constructEvent: () => {
        throw new Error("Stripe not configured");
      }
    }
  } as unknown as Stripe;
} else {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-02-24.acacia',
  });
}

export default stripe;