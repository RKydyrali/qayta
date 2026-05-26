import { SignUp } from "@clerk/clerk-react";
import { clerkAuthAppearance } from "@/lib/clerkAppearance";

export function SignUpPage() {
  return (
    <SignUp
      routing="path"
      path="/auth/sign-up"
      signInUrl="/auth/sign-in"
      appearance={clerkAuthAppearance}
    />
  );
}
