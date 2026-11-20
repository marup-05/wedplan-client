
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Check, Crown, Sparkles } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function VendorSubscriptionPage() {
  const { data: session } = authClient.useSession();
  const [plan, setPlan] = useState("Free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`${API_URL}/vendor/${session.user.id}/subscription`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not load plan");
        setPlan(data.plan || "Free");
      })
      .catch((error) => toast.error(error.message || "Could not load subscription"))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const features = [
    "Vendor Dashboard Access",
    "Create and Manage Services",
    "Booking Request Management",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#49333F]">Choose Your Plan</h2>
        <p className="mt-1 text-sm text-[#987B88]">
          Grow your wedding business with the right subscription.
        </p>
      </div>

      {loading ? (
        <p className="py-16 text-center text-sm text-[#987B88]">Loading subscription...</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          <div className={`rounded-2xl border bg-white p-6 ${plan === "Free" ? "border-[#E477A0] ring-1 ring-[#E477A0]" : "border-[#F0E2E7]"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#49333F]">Free Plan</h3>
              {plan === "Free" && <span className="rounded-full bg-[#FCECF2] px-3 py-1 text-xs font-bold text-[#D96F96]">Current Plan</span>}
            </div>
            <p className="mt-4 text-3xl font-bold text-[#49333F]">Free</p>
            <p className="mt-2 text-sm text-[#987B88]">Get started with your wedding business.</p>
            <div className="my-6 space-y-4">
              <p className="flex items-center gap-2 text-sm text-[#765D68]"><Check size={17} className="text-[#D96F96]" /> Maximum 3 active services</p>
              {features.map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm text-[#765D68]"><Check size={17} className="text-[#D96F96]" /> {feature}</p>
              ))}
            </div>
            <button disabled className="w-full cursor-not-allowed rounded-xl border border-[#EEDFE5] bg-[#FFF9F6] px-4 py-3 text-sm font-semibold text-[#987B88]">
              {plan === "Free" ? "Current Plan" : "Free Plan"}
            </button>
          </div>

          <div className={`relative rounded-2xl border bg-white p-6 ${plan === "Premium" ? "border-amber-400 ring-1 ring-amber-300" : "border-[#F0E2E7]"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#49333F]">Premium Plan</h3>
              {plan === "Premium" ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Current Plan</span>
              ) : (
                <Crown size={23} className="text-amber-500" />
              )}
            </div>
            <p className="mt-4 text-3xl font-bold text-[#49333F]">Premium</p>
            <p className="mt-2 text-sm text-[#987B88]">Unlock more opportunities for your business.</p>
            <div className="my-6 space-y-4">
              <p className="flex items-center gap-2 text-sm text-[#765D68]"><Check size={17} className="text-amber-500" /> Unlimited active services</p>
              <p className="flex items-center gap-2 text-sm text-[#765D68]"><Check size={17} className="text-amber-500" /> Premium Vendor Badge</p>
              {features.map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm text-[#765D68]"><Check size={17} className="text-amber-500" /> {feature}</p>
              ))}
            </div>
            <button
              disabled={plan === "Premium"}
              onClick={() => toast.info("Premium payment with Stripe will be enabled in the payment integration step.")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E477A0] px-4 py-3 text-sm font-semibold text-white hover:bg-[#D96F96] disabled:cursor-not-allowed disabled:bg-amber-500"
            >
              <Sparkles size={17} />
              {plan === "Premium" ? "Premium Activated" : "Upgrade to Premium"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
