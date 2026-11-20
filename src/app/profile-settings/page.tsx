
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Camera,
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  Save,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type ProfileUser = {
  id: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: string;
  emailVerified?: boolean;
  createdAt?: string | Date;
};

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as ProfileUser | undefined;

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending || !session || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFF9F6]">
        <Loader2 className="animate-spin text-[#D96F96]" size={30} />
      </div>
    );
  }

  return <ProfileSettingsForm key={user.id} user={user} />;
}

function ProfileSettingsForm({ user }: { user: ProfileUser }) {
  const router = useRouter();

  // Initial values come directly from the authenticated user.
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.image || "");
  const [loading, setLoading] = useState(false);

  const role = user.role?.toLowerCase() || "customer";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Available soon";

  const completionItems = [
    Boolean(name.trim()),
    Boolean(user.email),
    Boolean(preview),
  ];

  const completion = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  const handleImageChange = (file?: File) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = image;

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

      const result = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl || null,
      });

      if (result.error) {
        throw new Error(result.error.message || "Profile update failed.");
      }

      setImage(imageUrl);
      setPreview(imageUrl);
      setImageFile(null);

      await authClient.getSession();
      router.refresh();

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF9F6] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D96F96]">
            Your Account
          </p>
          <h1 className="mt-2 font-logo text-4xl font-semibold text-[#49333F] sm:text-5xl">
            Profile Settings
          </h1>
          <p className="mt-2 text-sm text-[#987B88]">
            Manage your personal information and keep your WedPlan profile up to date.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-5">
            <div className="rounded-2xl border border-[#F0E3E7] bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Profile"
                      width={112}
                      height={112}
                      unoptimized
                      className="h-28 w-28 rounded-full border-4 border-[#FFF0F4] object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#FFF0F4] bg-[#F5E8EC] text-[#D96F96]">
                      <UserRound size={42} />
                    </div>
                  )}

                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#E88BAA] text-white shadow-sm transition hover:bg-[#D96F96]"
                    title="Change profile image"
                  >
                    <Camera size={16} />
                  </label>
                </div>

                <input
                  id="profile-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) =>
                    handleImageChange(event.target.files?.[0])
                  }
                />

                <h2 className="mt-4 text-lg font-semibold text-[#49333F]">
                  {name || "WedPlan User"}
                </h2>
                <p className="mt-1 max-w-full break-all text-xs text-[#987B88]">
                  {user.email}
                </p>
                <span className="mt-3 rounded-full bg-[#FFF0F4] px-4 py-1.5 text-xs font-semibold lowercase text-[#D96F96]">
                  {role}
                </span>
              </div>

              <div className="mt-6 border-t border-[#F0E3E7] pt-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#49333F]">
                    Profile Completion
                  </p>
                  <p className="text-sm font-semibold text-[#D96F96]">
                    {completion}%
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F5E8EC]">
                  <div
                    className="h-full rounded-full bg-[#E88BAA] transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-[#987B88]">
                  Add a profile photo and keep your details updated.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#F0E3E7] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#D96F96]" />
                <h3 className="text-sm font-semibold text-[#49333F]">
                  Your WedPlan Account
                </h3>
              </div>
              <p className="mt-2 text-xs leading-6 text-[#987B88]">
                {role === "vendor"
                  ? "Grow your wedding business and connect with customers through WedPlan."
                  : role === "admin"
                    ? "Manage and oversee the WedPlan platform from your admin account."
                    : "Your wedding journey starts here. Discover services and plan your special day."}
              </p>
            </div>
          </aside>

          <section className="space-y-5">
            <form
              onSubmit={handleSave}
              className="rounded-2xl border border-[#F0E3E7] bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#49333F]">
                  Personal Information
                </h2>
                <p className="mt-1 text-xs text-[#987B88]">
                  Update your profile details below.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="full-name"
                    className="mb-2 block text-sm font-medium text-[#49333F]"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <UserRound
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B49AA5]"
                    />
                    <input
                      id="full-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="h-12 w-full rounded-xl border border-[#EADDE1] bg-white pl-11 pr-4 text-sm text-[#49333F] outline-none transition focus:border-[#E88BAA] focus:ring-2 focus:ring-[#E88BAA]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#49333F]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B49AA5]"
                    />
                    <input
                      value={user.email || ""}
                      readOnly
                      className="h-12 w-full cursor-not-allowed rounded-xl border border-[#EADDE1] bg-[#FFF9F6] pl-11 pr-4 text-sm text-[#987B88] outline-none"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#987B88]">
                    Your email address cannot be changed here.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#49333F]">
                    Account Role
                  </label>
                  <div className="flex h-12 items-center justify-between rounded-xl border border-[#EADDE1] bg-[#FFF9F6] px-4">
                    <span className="text-sm capitalize text-[#987B88]">
                      {role}
                    </span>
                    <ShieldCheck size={18} className="text-[#D96F96]" />
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#987B88]">
                    Your account role is fixed and cannot be changed.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#F0E3E7] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setName(user.name || "");
                    setImage(user.image || "");
                    setPreview(user.image || "");
                    setImageFile(null);
                  }}
                  className="h-11 rounded-full border border-[#EADDE1] px-6 text-sm font-semibold text-[#66525E] transition hover:bg-[#FFF9F6]"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#E88BAA] px-7 text-sm font-semibold text-white transition hover:bg-[#D96F96] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            <div className="rounded-2xl border border-[#F0E3E7] bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-semibold text-[#49333F]">
                Account Overview
              </h2>
              <p className="mt-1 text-xs text-[#987B88]">
                A quick look at your account information.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl bg-[#FFF9F6] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5E8EC] text-[#D96F96]">
                    <CalendarDays size={19} />
                  </span>
                  <div>
                    <p className="text-xs text-[#987B88]">Member Since</p>
                    <p className="mt-1 text-sm font-semibold text-[#49333F]">
                      {memberSince}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-[#FFF9F6] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5E8EC] text-[#D96F96]">
                    <ShieldCheck size={19} />
                  </span>
                  <div>
                    <p className="text-xs text-[#987B88]">Email Verification</p>
                    <p className="mt-1 text-sm font-semibold text-[#49333F]">
                      {user.emailVerified ? "Verified" : "Not verified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
