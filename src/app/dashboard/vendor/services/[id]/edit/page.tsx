
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { API_URL, getAuthHeaders } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
    images: [] as string[],
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchService = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/services`, {
          headers: await getAuthHeaders(),
        });

        const services = await response.json();

        if (!response.ok) {
          throw new Error(services.message || "Could not load service");
        }

        const service = services.find(
          (item: { _id: string }) => item._id === params.id
        );

        if (!service) {
          toast.error("Service not found");
          router.replace("/dashboard/vendor/services");
          return;
        }

        setForm({
          serviceName: service.serviceName,
          category: service.category,
          description: service.description,
          price: String(service.price),
          location: service.location,
          images: service.images || [],
        });
        setPreview(service.images?.[0] || "");
      } catch {
        toast.error("Could not load service");
      } finally {
        setLoading(false);
      }
    };

    void fetchService();
  }, [session?.user?.id, params.id, router]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSaving(true);

    try {
      let images = form.images;

      if (file) {
        const imageData = new FormData();
        imageData.append("image", file);

        const uploadResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: "POST", body: imageData }
        );
        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error("Image upload failed");
        }

        images = [uploadResult.data.url];
      }

      const response = await fetch(`${API_URL}/services/${params.id}`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          images,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Update failed");

      toast.success("Service updated successfully");
      router.push("/dashboard/vendor/services");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="py-20 text-center text-sm text-[#987B88] dark:text-gray-400">Loading service...</p>;

  const inputClass = "w-full rounded-xl border border-[#EEDFE5] dark:border-white/10 bg-white dark:bg-[#25232B] px-4 py-3 text-sm text-[#49333F] dark:text-gray-100 outline-none focus:border-[#E477A0]";

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#49333F] dark:text-gray-100">Edit Service</h2>
        <p className="mt-1 text-sm text-[#987B88] dark:text-gray-400">Update your service information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#49333F] dark:text-gray-100">Service Name *</label>
          <input required className={inputClass} value={form.serviceName} onChange={(e) => setForm({ ...form, serviceName: e.target.value })} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#49333F] dark:text-gray-100">Category *</label>
          <select required className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select category</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#49333F] dark:text-gray-100">Description *</label>
          <textarea required rows={5} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#49333F] dark:text-gray-100">Price (BDT) *</label>
            <input type="number" min="1" required className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#49333F] dark:text-gray-100">Location *</label>
            <input required className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#49333F] dark:text-gray-100">Service Image</label>
          {preview && <Image width={600} height={240} src={preview} alt="Service" className="mb-3 h-40 w-full rounded-xl object-cover" />}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="w-full text-sm text-[#765D68] dark:text-gray-300"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (!selected) return;
              if (selected.size > 5 * 1024 * 1024) {
                toast.error("Image must be under 5MB");
                return;
              }
              setFile(selected);
              setPreview(URL.createObjectURL(selected));
            }}
          />
        </div>

        <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E477A0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#D96F96] disabled:opacity-60">
          {saving && <Loader2 size={17} className="animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
