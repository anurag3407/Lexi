export const plans = [
    {
        id: "free",
        name: "Free",
        description: "Perfect for getting started with basic features",
        price: 0,
        features: [
            "2 Document uploads",
            "3 messages per document",
            "Basic AI chat support",
            "Standard processing speed",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        description: "Ideal for professionals needing advanced features",
        price: 9.99,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        features: [
            "20 Document uploads",
            "100 messages per document",
            "Priority AI processing",
            "Advanced analytics",
            "Priority customer support",
        ],
    },
];

export const FREE_LIMIT = 2;
export const PRO_LIMIT = 20;
export const FREE_MESSAGE_LIMIT = 3;
export const PRO_MESSAGE_LIMIT = 100;
