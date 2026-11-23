
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { authClient } from "@/lib/auth-client";

const dashboardPaths: Record<string, string> = {
  vendor: "/dashboard/vendor",
  customer: "/dashboard/customer",
  admin: "/dashboard/admin",
};

export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectByRole = async () => {
    const { data: session } = await authClient.getSession();
    const role = (session?.user as { role?: string } | undefined)?.role;

    router.replace(dashboardPaths[role?.toLowerCase() || ""] || "/");
    router.refresh();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoading(true);

    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        toast.error(result.error.message || "Invalid email or password.");
        return;
      }

      toast.success("Successfully signed in!");
      await redirectByRole();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/redirect?from=signin",
        errorCallbackURL: "/auth/redirect?from=signin",
      });

      if (result.error) {
        toast.error(result.error.message || "Google login failed.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D96F96]">
          Welcome Back
        </p>
        <h1 className="mt-3 font-logo text-4xl font-semibold text-[#49333F] dark:text-gray-100 sm:text-5xl">
          Sign In
        </h1>
        <p className="mt-3 text-sm text-[#987B88] dark:text-gray-400">
          Welcome back! Please enter your details.
        </p>
      </div>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#EADDE1] dark:bg-white/10" />
        <span className="text-xs text-[#987B88] dark:text-gray-400">Continue with email</span>
        <div className="h-px flex-1 bg-[#EADDE1] dark:bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#49333F] dark:text-gray-100">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="h-12 w-full rounded-lg border border-[#EADDE1] dark:border-white/10 bg-white dark:bg-[#25232B] px-4 text-sm text-[#49333F] dark:text-gray-100 outline-none placeholder:text-[#B7A4AD] dark:placeholder:text-gray-500 focus:border-[#E88BAA]"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#49333F] dark:text-gray-100">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              className="h-12 w-full rounded-lg border border-[#EADDE1] dark:border-white/10 bg-white dark:bg-[#25232B] px-4 pr-12 text-sm text-[#49333F] dark:text-gray-100 outline-none placeholder:text-[#B7A4AD] dark:placeholder:text-gray-500 focus:border-[#E88BAA]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-[#987B88] dark:text-gray-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <span className="cursor-default text-xs font-semibold text-[#D96F96]">
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-[#E88BAA] text-sm font-semibold text-white transition hover:bg-[#D96F96] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#EADDE1] dark:bg-white/10" />
        <span className="text-xs text-[#987B88] dark:text-gray-400">or</span>
        <div className="h-px flex-1 bg-[#EADDE1] dark:bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#EADDE1] dark:border-white/10 text-sm font-semibold text-[#49333F] dark:text-gray-100 transition hover:bg-[#FFF9F6] dark:hover:bg-white/10 disabled:opacity-60"
      >
        <FcGoogle size={21} />
        {googleLoading ? "Redirecting..." : "Continue with Google"}
      </button>

      <p className="mt-7 text-center text-sm text-[#987B88] dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold text-[#D96F96] hover:underline">
          Get Started
        </Link>
      </p>
    </AuthLayout>
  );
}
