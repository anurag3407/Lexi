import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black grid-background">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-white text-black hover:bg-[#e5e5e5]",
            card: "bg-[#0a0a0a] border border-[#262626]",
            headerTitle: "text-white",
            headerSubtitle: "text-[#666666]",
            socialButtonsBlockButton: "bg-[#1a1a1a] border-[#262626] text-white hover:bg-[#262626]",
            formFieldLabel: "text-[#a1a1a1]",
            formFieldInput: "bg-[#1a1a1a] border-[#262626] text-white",
            footerActionLink: "text-blue-500 hover:text-blue-400",
            identityPreviewEditButton: "text-blue-500",
            formFieldInputShowPasswordButton: "text-[#666666]",
          }
        }}
      />
    </div>
  );
}
