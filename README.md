# 📚 Lexi - Chat with PDF

<div align="center">

![Lexi Logo](https://img.shields.io/badge/Lexi-Chat%20with%20PDF-indigo?style=for-the-badge&logo=files&logoColor=white)

**An intelligent document assistant powered by AI**

Upload your PDF documents and have natural conversations with them using Google's Gemini AI.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)

</div>

---

## ✨ Features

- 📄 **PDF Upload & Storage** - Securely upload and store your PDF documents
- 💬 **AI-Powered Chat** - Have intelligent conversations with your documents using Gemini AI
- 🔍 **Semantic Search** - Find relevant information quickly using vector embeddings
- 🔐 **User Authentication** - Secure authentication with Clerk
- 💳 **Subscription Plans** - Free and Pro tiers with Stripe integration
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Real-time Updates** - Instant message updates with Firebase

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js App   │────▶│   Firebase      │────▶│   Pinecone      │
│   (Frontend)    │     │   (Storage/DB)  │     │   (Vectors)     │
│                 │     │                 │     │                 │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Clerk Auth    │     │   Gemini AI     │     │   Stripe        │
│   (Users)       │     │   (LLM)         │     │   (Payments)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- Pinecone account
- Google AI Studio account (for Gemini API)
- Clerk account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lexi.git
   cd lexi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in all the required environment variables (see Configuration section below).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

#### Clerk Authentication
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### Firebase
```env
# Client-side
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Server-side (from service account)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=...
```

#### Pinecone
```env
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=lexi
```

#### Google Gemini AI
```env
GOOGLE_API_KEY=...
```

#### Stripe
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## �� Project Structure

```
lexi/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── files/[id]/     # Document chat page
│   │   │   ├── upgrade/        # Pricing page
│   │   │   └── upload/         # File upload page
│   │   ├── sign-in/            # Clerk sign-in page
│   │   ├── sign-up/            # Clerk sign-up page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   │   ├── ui/                 # UI primitives (Button, Input, etc.)
│   │   ├── Chat.tsx            # Chat interface
│   │   ├── ChatMessage.tsx     # Message bubble component
│   │   ├── Document.tsx        # Document card
│   │   ├── Documents.tsx       # Document list
│   │   ├── FileUploader.tsx    # Drag & drop uploader
│   │   ├── Header.tsx          # Navigation header
│   │   ├── PdfView.tsx         # PDF viewer
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-toast.ts        # Toast notifications
│   │   ├── useSubscription.ts  # Subscription status
│   │   └── useUpload.ts        # File upload logic
│   ├── lib/                    # Utility libraries
│   │   ├── langchain.ts        # LangChain + Gemini integration
│   │   ├── pinecone.ts         # Pinecone client
│   │   ├── stripe.ts           # Stripe server client
│   │   ├── stripe-js.ts        # Stripe client
│   │   └── utils.ts            # Helper functions
│   └── middleware.ts           # Clerk auth middleware
├── actions/                    # Server actions
│   ├── askQuestion.ts          # Process chat questions
│   ├── createCheckoutSessions.ts
│   ├── createStripePortal.ts
│   ├── deleteDocument.ts
│   └── generateEmbeddings.ts
├── hooks/                      # Root-level hooks
├── firebase.ts                 # Firebase client config
├── firbaseAdmin.ts             # Firebase Admin config
├── constants.ts                # App constants
└── ...config files
```

---

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS 4** | Utility-first CSS |
| **Clerk** | Authentication & user management |
| **Firebase** | Database (Firestore) & file storage |
| **Pinecone** | Vector database for embeddings |
| **LangChain** | AI/LLM orchestration |
| **Google Gemini** | AI model for chat & embeddings |
| **Stripe** | Payment processing |
| **React PDF** | PDF rendering |

---

## 📋 API Routes & Server Actions

### Server Actions

| Action | Description |
|--------|-------------|
| `askQuestion(id, question)` | Send a question to AI about a document |
| `generateEmbeddings(docId)` | Generate vector embeddings for a document |
| `deleteDocument(docId)` | Delete a document and its data |
| `createCheckoutSession(userDetails)` | Create Stripe checkout session |
| `createStripePortal()` | Create Stripe customer portal session |

---

## 💳 Subscription Tiers

### Free Plan
- 2 document uploads
- 3 messages per document
- Basic AI chat support

### Pro Plan ($9.99/month)
- 20 document uploads
- 100 messages per document
- Priority AI processing
- Advanced analytics
- Priority support

---

## 🔒 Security

- All routes under `/dashboard` are protected by Clerk middleware
- Firebase Security Rules protect user data
- Environment variables for sensitive keys
- Server-side validation for all actions

---

## 🧪 Development

### Running locally
```bash
npm run dev
```

### Building for production
```bash
npm run build
```

### Running production build
```bash
npm start
```

### Linting
```bash
npm run lint
```

---

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

### Environment Variables in Production
Make sure to add all environment variables from `.env.example` to your deployment platform.

---

## 🐛 Troubleshooting

### Common Issues

**"Firebase bucket not found"**
- Ensure `FIREBASE_STORAGE_BUCKET` is set correctly (format: `project-id.appspot.com`)

**"Pinecone index not found"**
- Create an index named `lexi` in Pinecone dashboard with dimension `768`

**"Clerk authentication not working"**
- Check that middleware.ts is in the `src/` directory
- Verify Clerk environment variables

**"Stripe checkout failing"**
- Ensure `STRIPE_PRICE_ID` is a valid price ID from your Stripe dashboard

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication
- [Firebase](https://firebase.google.com/) - Backend services
- [Pinecone](https://www.pinecone.io/) - Vector database
- [LangChain](https://langchain.com/) - AI orchestration
- [Google Gemini](https://ai.google.dev/) - AI model
- [Stripe](https://stripe.com/) - Payments

---

<div align="center">

Made by Anurag

⭐ Star this repo if you find it helpful!

</div>
