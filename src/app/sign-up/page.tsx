"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Heart, Store, Upload, UserRound } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignUpPage() {
  const [role, setRole] = useState("customer");
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D96F96]">
          Start Your Journey
        </p>

        <h1 className="mt-2 font-logo text-4xl font-semibold text-[#49333F] sm:text-5xl">
          Create Account
        </h1>

        <p className="mt-2 text-sm text-[#987B88]">
          Join WedPlan and make your wedding journey special.
        </p>
      </div>

      {/* Account Role */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-[#49333F]">
          Choose Account Type
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`rounded-xl border p-3 text-left transition ${
              role === "customer"
                ? "border-[#E88BAA] bg-[#FFF3F7]"
                : "border-[#EADDE1] bg-white hover:bg-[#FFF9F6]"
            }`}
          >
            <Heart size={20} className="text-[#D96F96]" />

            <p className="mt-2 text-sm font-semibold text-[#49333F]">
              Customer
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#987B88]">
              Discover wedding services and plan your special day.
            </p>

            <span
              className={`mt-2 block text-[10px] font-semibold ${
                role === "customer" ? "text-[#D96F96]" : "text-transparent"
              }`}
            >
              Selected
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("vendor")}
            className={`rounded-xl border p-3 text-left transition ${
              role === "vendor"
                ? "border-[#E88BAA] bg-[#FFF3F7]"
                : "border-[#EADDE1] bg-white hover:bg-[#FFF9F6]"
            }`}
          >
            <Store size={20} className="text-[#D96F96]" />

            <p className="mt-2 text-sm font-semibold text-[#49333F]">
              Vendor
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#987B88]">
              Showcase services and manage customer bookings.
            </p>

            <span
              className={`mt-2 block text-[10px] font-semibold ${
                role === "vendor" ? "text-[#D96F96]" : "text-transparent"
              }`}
            >
              Selected
            </span>
          </button>
        </div>
      </div>

      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#EADDE1]" />
        <span className="text-xs text-[#987B88]">Register with email</span>
        <div className="h-px flex-1 bg-[#EADDE1]" />
      </div>

      <form className="space-y-4">
        <input type="hidden" name="role" value={role} />

        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-[#49333F]"
          >
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            required
            className="h-11 w-full rounded-lg border border-[#EADDE1] px-4 text-sm text-[#49333F] outline-none placeholder:text-[#B7A4AD] focus:border-[#E88BAA]"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[#49333F]"
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="h-11 w-full rounded-lg border border-[#EADDE1] px-4 text-sm text-[#49333F] outline-none placeholder:text-[#B7A4AD] focus:border-[#E88BAA]"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-[#49333F]"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            required
            minLength={6}
            pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
            title="At least 6 characters, one uppercase and one lowercase letter"
            className="h-11 w-full rounded-lg border border-[#EADDE1] px-4 text-sm text-[#49333F] outline-none placeholder:text-[#B7A4AD] focus:border-[#E88BAA]"
          />

          <p className="mt-1.5 text-[11px] text-[#987B88]">
            Minimum 6 characters, including uppercase and lowercase letters.
          </p>
        </div>

        {/* Profile Image */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#49333F]">
            Profile Image{" "}
            <span className="font-normal text-[#987B88]">(Require)</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#E8B5C7] bg-[#FFF9F6] p-3 transition hover:bg-[#FDF0F4]">
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5E8EC] text-[#D96F96]">
                <UserRound size={20} />
              </div>
            )}

            <div className="flex-1">
              <p className="text-xs font-semibold text-[#49333F]">
                {imagePreview ? "Image selected" : "Upload profile image"}
              </p>

              <p className="mt-1 text-[10px] text-[#987B88]">
                JPG, PNG or WEBP
              </p>
            </div>

            <Upload size={18} className="text-[#D96F96]" />

            <input
              type="file"
              name="profileImage"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) =>
                handleImageChange(event.target.files?.[0])
              }
            />
          </label>
        </div>

        {/* Create Account */}
        <button
          type="button"
          disabled
          className="h-12 w-full rounded-full bg-[#E88BAA] text-sm font-semibold text-white transition hover:bg-[#D96F96]"
        >
          Create Account
        </button>
      </form>

      {/* Google Sign Up - Below Form */}
      <button
        type="button"
        disabled
        className="mt-5 flex h-11 w-full items-center justify-center gap-3 rounded-full border border-[#EADDE1] text-sm font-semibold text-[#49333F] transition hover:bg-[#FFF9F6]"
      >
        <FcGoogle size={21} />
        Continue with Google
      </button>

      <p className="mt-5 text-center text-sm text-[#987B88]">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-[#D96F96] hover:underline"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}