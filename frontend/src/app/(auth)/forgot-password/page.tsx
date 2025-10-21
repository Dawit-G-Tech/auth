import { ForgotPasswordView } from "@/modules/auth/views/forget-password";

export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-4">

        <ForgotPasswordView />
      </div>
    </div>
  );
};
