
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (selected: File | undefined) => {
    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("Please sign in first.");
      return;
    }

    if (!file) {
      toast.error("Please upload a service image.");
      return;
    }

    setLoading(true);

    try {
      const imageData = new FormData();
      imageData.append("image", file);

      const uploadResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error("Image upload failed.");
      }

      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          vendorId: session.user.id,
          images: [uploadResult.data.url],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not submit service.");
      }

      toast.success("Service submitted for admin approval!");

      router.push("/dashboard/vendor/services");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fieldClass =
    "w-full rounded-xl border border-[#EEDFE5] bg-white px-4 py-3 text-sm text-[#49333F] outline-none transition focus:border-[#E477A0]";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#49333F]">
          Create a Service
        </h2>
        <p className="mt-1 text-sm text-[#987B88]">
          Add your wedding service and submit it for approval.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-[#F0E2E7] bg-white p-5 shadow-sm md:p-7"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#49333F]">
            Service Name *
          </label>
          <input
            name="serviceName"
            required
            value={form.serviceName}
            onChange={updateField}
            placeholder="e.g. Premium Wedding Photography"
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#49333F]">
            Service Category *
          </label>
          <select
            name="category"
            required
            value={form.category}
            onChange={updateField}
            className={fieldClass}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#49333F]">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={5}
            value={form.description}
            onChange={updateField}
            placeholder="Describe your service..."
            className={fieldClass}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#49333F]">
              Price (USD) *
            </label>
            <input
              name="price"
              type="number"
              min="1"
              required
              value={form.price}
              onChange={updateField}
              placeholder="Enter price in USD"
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#49333F]">
              Location *
            </label>
            <input
              name="location"
              required
              value={form.location}
              onChange={updateField}
              placeholder="e.g. Dhaka, Bangladesh"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#49333F]">
            Service Image *
          </label>

          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#EEDFE5] bg-[#FFFAFC] p-4 text-center hover:border-[#E477A0]">
            {preview ? (
              <Image
                width={600}
                height={240}
                src={preview}
                alt="Service preview"
                unoptimized
                className="max-h-52 rounded-lg object-cover"
              />
            ) : (
              <>
                <ImagePlus size={32} className="text-[#D96F96]" />
                <span className="mt-3 text-sm font-semibold text-[#49333F]">
                  Upload service image
                </span>
                <span className="mt-1 text-xs text-[#987B88]">
                  JPG, PNG or WEBP · Max 5MB
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0])}
            />
          </label>

          {file && (
            <p className="text-xs text-[#987B88]">{file.name}</p>
          )}
        </div>

        <div className="rounded-xl bg-[#FFF5F8] p-4 text-sm text-[#765D68]">
          Your service will be submitted with{" "}
          <strong>Pending</strong> status. It will become visible to
          customers only after admin approval.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E477A0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#D96F96] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <UploadCloud size={18} />
          )}
          {loading ? "Submitting..." : "Submit Service"}
        </button>
      </form>
    </div>
  );
}
