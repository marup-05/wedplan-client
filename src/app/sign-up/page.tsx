
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import {
  Eye,
  EyeOff,
  Heart,
  Store,
  Upload,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { authClient } from "@/lib/auth-client";

const dashboardPaths: Record<string, string> = {
  vendor: "/dashboard/vendor",
  customer: "/dashboard/customer",
  admin: "/dashboard/admin",
};

export default function SignUpPage() {
  const router = useRouter();

  const [role, setRole] = useState("customer");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") as string).trim();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoading(true);

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("image", imageFile);

        const uploadResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: "POST", body: imageData }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error("Image upload failed. Please try again.");
        }

        imageUrl = uploadResult.data.url;
      }

      const result = await authClient.signUp.email({
        name,
        email,
        password,
        ...(imageUrl && { image: imageUrl }),
        role,
      });

      if (result.error) {
        toast.error(result.error.message || "Account creation failed.");
        return;
      }

      toast.success("Your account has been created successfully!");

      const { data: session } = await authClient.getSession();
      const sessionRole = (session?.user as { role?: string } | undefined)?.role;

      router.replace(
        dashboardPaths[sessionRole?.toLowerCase() || ""] ||
          dashboardPaths[role] ||
          "/"
      );
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/redirect?from=signup",
        errorCallbackURL: "/auth/redirect?from=signup",
      });

      if (result.error) {
        toast.error(result.error.message || "Google sign up failed.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Google sign up failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D96F96]">
          Start Your Journey
        </p>
        <h1 className="mt-2 font-logo text-4xl font-semibold text-[#49333F] dark:text-gray-100 sm:text-5xl">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-[#987B88] dark:text-gray-400">
          Join WedPlan and make your wedding journey special.
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-[#49333F] dark:text-gray-100">
          Choose Account Type
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`rounded-xl border p-3 text-left transition ${
              role === "customer"
                ? "border-[#E88BAA] bg-[#FFF3F7] dark:bg-[#E88BAA]/10"
                : "border-[#EADDE1] dark:border-white/10 bg-white dark:bg-[#25232B] hover:bg-[#FFF9F6] dark:hover:bg-white/10"
            }`}
          >
            <Heart size={20} className="text-[#D96F96]" />
            <p className="mt-2 text-sm font-semibold text-[#49333F] dark:text-gray-100">Customer</p>
            <p className="mt-1 text-[11px] leading-5 text-[#987B88] dark:text-gray-400">
              Discover wedding services and plan your special day.
            </p>
            <span className={`mt-2 block text-[10px] font-semibold ${role === "customer" ? "text-[#D96F96]" : "text-transparent"}`}>
              Selected
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("vendor")}
            className={`rounded-xl border p-3 text-left transition ${
              role === "vendor"
                ? "border-[#E88BAA] bg-[#FFF3F7] dark:bg-[#E88BAA]/10"
                : "border-[#EADDE1] dark:border-white/10 bg-white dark:bg-[#25232B] hover:bg-[#FFF9F6] dark:hover:bg-white/10"
            }`}
          >
            <Store size={20} className="text-[#D96F96]" />
            <p className="mt-2 text-sm font-semibold text-[#49333F] dark:text-gray-100">Vendor</p>
            <p className="mt-1 text-[11px] leading-5 text-[#987B88] dark:text-gray-400">
              Showcase services and manage customer bookings.
            </p>
            <span className={`mt-2 block text-[10px] font-semibold ${role === "vendor" ? "text-[#D96F96]" : "text-transparent"}`}>
              Selected
            </span>
          </button>
        </div>
      </div>

      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#EADDE1] dark:bg-white/10" />
        <span className="text-xs text-[#987B88] dark:text-gray-400">Register with email</span>
        <div className="h-px flex-1 bg-[#EADDE1] dark:bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#49333F] dark:text-gray-100">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            required
            className="h-11 w-full rounded-lg border border-[#EADDE1] dark:border-white/10 dark:bg-[#25232B] px-4 text-sm text-[#49333F] dark:text-gray-100 outline-none placeholder:text-[#B7A4AD] dark:placeholder:text-gray-500 focus:border-[#E88BAA]"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#49333F] dark:text-gray-100">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="h-11 w-full rounded-lg border border-[#EADDE1] dark:border-white/10 dark:bg-[#25232B] px-4 text-sm text-[#49333F] dark:text-gray-100 outline-none placeholder:text-[#B7A4AD] dark:placeholder:text-gray-500 focus:border-[#E88BAA]"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#49333F] dark:text-gray-100">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              required
              minLength={6}
              pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
              title="At least 6 characters, one uppercase and one lowercase letter"
              className="h-11 w-full rounded-lg border border-[#EADDE1] dark:border-white/10 dark:bg-[#25232B] px-4 pr-12 text-sm text-[#49333F] dark:text-gray-100 outline-none placeholder:text-[#B7A4AD] dark:placeholder:text-gray-500 focus:border-[#E88BAA]"
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
          <p className="mt-1.5 text-[11px] text-[#987B88] dark:text-gray-400">
            Minimum 6 characters, including uppercase and lowercase letters.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#49333F] dark:text-gray-100">
            Profile Image <span className="font-normal text-[#987B88] dark:text-gray-400">(Optional)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#E8B5C7] dark:border-[#E8B5C7]/30 bg-[#FFF9F6] dark:bg-white/5 p-3 transition hover:bg-[#FDF0F4] dark:hover:bg-white/10">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile preview"
                width={42}
                height={42}
                className="h-10 w-10 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5E8EC] dark:bg-white/10 text-[#D96F96]">
                <UserRound size={20} />
              </div>
            )}

            <div className="flex-1">
              <p className="text-xs font-semibold text-[#49333F] dark:text-gray-100">
                {imagePreview ? "Image selected" : "Upload profile image"}
              </p>
              <p className="mt-1 text-[10px] text-[#987B88] dark:text-gray-400">JPG, PNG or WEBP</p>
            </div>

            <Upload size={18} className="text-[#D96F96]" />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => handleImageChange(event.target.files?.[0])}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-[#E88BAA] text-sm font-semibold text-white transition hover:bg-[#D96F96] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#EADDE1] dark:bg-white/10" />
        <span className="text-xs text-[#987B88] dark:text-gray-400">or</span>
        <div className="h-px flex-1 bg-[#EADDE1] dark:bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={googleLoading}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-[#EADDE1] dark:border-white/10 text-sm font-semibold text-[#49333F] dark:text-gray-100 transition hover:bg-[#FFF9F6] dark:hover:bg-white/10 disabled:opacity-60"
      >
        <FcGoogle size={21} />
        {googleLoading ? "Redirecting..." : "Continue with Google"}
      </button>

      <p className="mt-5 text-center text-sm text-[#987B88] dark:text-gray-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-[#D96F96] hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
