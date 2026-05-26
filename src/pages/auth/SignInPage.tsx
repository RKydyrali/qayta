import { SignIn } from "@clerk/clerk-react";
import { clerkAuthAppearance } from "@/lib/clerkAppearance";

export function SignInPage() {
  return (
    <SignIn
      routing="path"
      path="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      appearance={clerkAuthAppearance}
    />
  );
}
