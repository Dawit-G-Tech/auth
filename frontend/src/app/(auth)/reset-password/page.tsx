import { ResetPasswordView } from "@/modules/auth/views/reset-password";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const token = (await searchParams).token;

  if (!token) redirect("/sign-up");

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
        <ResetPasswordView/>
    </div>
  );
}