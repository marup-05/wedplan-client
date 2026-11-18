import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D96F96]">
          Welcome Back
        </p>

        <h1 className="mt-3 font-logo text-4xl font-semibold text-[#49333F] sm:text-5xl">
          Sign In
        </h1>

        <p className="mt-3 text-sm text-[#987B88]">
          Welcome back! Please enter your details.
        </p>
      </div>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#EADDE1]" />
        <span className="text-xs text-[#987B88]">Continue with email</span>
        <div className="h-px flex-1 bg-[#EADDE1]" />
      </div>

      <form className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[#49333F]"
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="h-12 w-full rounded-lg border border-[#EADDE1] bg-white px-4 text-sm text-[#49333F] outline-none placeholder:text-[#B7A4AD] focus:border-[#E88BAA]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[#49333F]"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            className="h-12 w-full rounded-lg border border-[#EADDE1] bg-white px-4 text-sm text-[#49333F] outline-none placeholder:text-[#B7A4AD] focus:border-[#E88BAA]"
          />
        </div>

        <div className="flex justify-end">
          <span className="cursor-default text-xs font-semibold text-[#D96F96]">
            Forgot password?
          </span>
        </div>

        <button
          type="button"
          disabled
          className="h-12 w-full rounded-full bg-[#E88BAA] text-sm font-semibold text-white transition hover:bg-[#D96F96] disabled:cursor-not-allowed"
        >
          Sign In
        </button>
      </form>

      {/* Google Login - Below Form */}
      <button
        type="button"
        disabled
        className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#EADDE1] text-sm font-semibold text-[#49333F] transition hover:bg-[#FFF9F6] disabled:cursor-not-allowed"
      >
        <FcGoogle size={21} />
        Continue with Google
      </button>

      <p className="mt-7 text-center text-sm text-[#987B88]">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-[#D96F96] hover:underline"
        >
          Get Started
        </Link>
      </p>
    </AuthLayout>
  );
}