
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950">
      <SignUp appearance={{
        elements: {
          rootBox: "w-full mx-auto",
          card: "bg-surface-900 border border-surface-800 shadow-xl",
          headerTitle: "text-white font-heading",
          headerSubtitle: "text-surface-400",
          formButtonPrimary: "bg-brand-500 hover:bg-brand-400 text-white",
          formFieldLabel: "text-surface-300",
          formFieldInput: "bg-surface-950 border-surface-800 text-white",
          footerActionText: "text-surface-400",
          footerActionLink: "text-brand-400 hover:text-brand-300"
        }
      }} />
    </div>
  );
}
