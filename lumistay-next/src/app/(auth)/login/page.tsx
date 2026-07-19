import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="theme-ops flex min-h-screen items-center justify-center bg-ops-bg px-4 py-10">
      <Suspense fallback={<div className="text-slate-500">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
