
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, UploadCloud, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_URL, getAuthHeaders } from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";

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

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImage = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const validFiles: File[] = [];

    for (const file of newFiles) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`${file.name}: Only JPG, PNG and WEBP are allowed.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Image size must be under 5MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (files.length + validFiles.length > 5) {
      toast.error("You can upload maximum 5 images.");
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);

    setPreviews((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("Please sign in first.");
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload at least one service image.");
      return;
    }

    setLoading(true);

    try {
      const images = await Promise.all(
        files.map(async (file) => {
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
            throw new Error(`Image upload failed: ${file.name}`);
          }

          return uploadResult.data.url;
        })
      );

      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          images,
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

        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-[#49333F]">
              Service Images * (Maximum 5)
            </label>
            <p className="mt-1 text-xs text-[#987B88]">
              JPG, PNG or WEBP · Max 5MB per image
            </p>
          </div>

          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#EEDFE5] bg-[#FFFAFC] p-5 text-center transition hover:border-[#E477A0]">
            <ImagePlus size={32} className="text-[#D96F96]" />

            <span className="mt-3 text-sm font-semibold text-[#49333F]">
              Click to upload images
            </span>

            <span className="mt-1 text-xs text-[#987B88]">
              You can select multiple images or add more later
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              disabled={files.length >= 5}
              className="hidden"
              onChange={(e) => {
                handleImage(e.target.files);
                e.target.value = "";
              }}
            />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previews.map((preview, index) => (
                <div
                  key={preview}
                  className="relative overflow-hidden rounded-xl border border-[#EEDFE5] p-2"
                >
                  <Image
                    width={300}
                    height={200}
                    src={preview}
                    alt={`Service image ${index + 1}`}
                    unoptimized
                    className="h-32 w-full rounded-lg object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-3 top-3 rounded-full bg-white p-1.5 text-red-500 shadow hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>

                  <p className="mt-2 truncate text-xs text-[#987B88]">
                    {files[index].name}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-[#987B88]">
            {files.length}/5 images selected
          </p>
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
          {loading ? "Uploading Images & Submitting..." : "Submit Service"}
        </button>
      </form>
    </div>
  );
}
