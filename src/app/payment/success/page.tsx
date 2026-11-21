
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Crown,
  Mail,
  CalendarDays,
  CreditCard,
  Receipt,
  Sparkles,
  Infinity,
  ArrowRight,
} from "lucide-react";
import { stripe } from "@/lib/stripe";
import { checkoutVerify } from "@/lib/actions/payments";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/dashboard/vendor/subscription");
  }

  let session;

  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8FA] p-5">
        <div className="rounded-2xl border border-[#F0E2E7] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#49333F]">
            Payment Verification Failed
          </h1>
          <p className="mt-2 text-sm text-[#987B88]">
            We could not verify your payment. Please try again.
          </p>
          <Link
            href="/dashboard/vendor/subscription"
            className="mt-5 inline-block rounded-xl bg-[#E477A0] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Subscription
          </Link>
        </div>
      </div>
    );
  }

  if (
    session.status !== "complete" ||
    session.payment_status !== "paid" ||
    session.mode !== "payment"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8FA] p-5">
        <div className="rounded-2xl border border-[#F0E2E7] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#49333F]">
            Payment Not Completed
          </h1>
          <p className="mt-2 text-sm text-[#987B88]">
            Your payment has not been completed yet.
          </p>
          <Link
            href="/dashboard/vendor/subscription"
            className="mt-5 inline-block rounded-xl bg-[#E477A0] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Subscription
          </Link>
        </div>
      </div>
    );
  }

  let activationFailed = false;

  try {
    const result = await checkoutVerify(session_id);

    if (
      result.message !== "Premium activated successfully" &&
      result.message !== "Payment already verified"
    ) {
      activationFailed = true;
    }
  } catch {
    activationFailed = true;
  }

  if (activationFailed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8FA] p-5">
        <div className="rounded-2xl border border-[#F0E2E7] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#49333F]">
            Premium Activation Failed
          </h1>
          <p className="mt-2 text-sm text-[#987B88]">
            Your payment was successful, but we could not activate Premium.
            Please contact support.
          </p>
          <Link
            href="/dashboard/vendor/subscription"
            className="mt-5 inline-block rounded-xl bg-[#E477A0] px-5 py-3 text-sm font-semibold text-white"
          >
            Go to Subscription
          </Link>
        </div>
      </div>
    );
  }

  const email =
    session.customer_details?.email ||
    session.customer_email ||
    "Not available";

  // Fixed: Handle nullable currency
  const currency = (session.currency ?? "usd").toUpperCase();

  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format((session.amount_total || 0) / 100);

  const paymentDate = new Date(session.created * 1000).toLocaleString(
    "en-US",
    {
      dateStyle: "long",
      timeStyle: "short",
    }
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF8FA] px-4 py-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#F0E2E7] bg-white shadow-[0_15px_60px_rgba(228,119,160,0.10)]">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E477A0] to-[#D85D8D] px-6 py-10 text-center text-white">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10" />

          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            <CheckCircle2 size={48} className="text-[#E477A0]" />
          </div>

          <h1 className="relative mt-5 text-3xl font-bold">
            Payment Successful!
          </h1>

          <p className="relative mt-2 text-sm text-white/90">
            Congratulations! Your WedPlan Premium plan is now active.
          </p>

          <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold">
            <Crown size={17} />
            Premium Member
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">

          {/* Premium activated */}
          <div className="rounded-2xl border border-[#F4D5E1] bg-[#FFF5F8] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FCE1EB] text-[#D85D8D]">
                <Sparkles size={23} />
              </div>

              <div>
                <h2 className="font-bold text-[#49333F]">
                  Premium Activated
                </h2>
                <p className="text-xs text-[#987B88]">
                  Your account has been upgraded successfully.
                </p>
              </div>

              <div className="ml-auto">
                <CheckCircle2 size={23} className="text-green-500" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-white p-4">
              <Infinity size={30} className="text-[#E477A0]" />

              <div>
                <p className="font-semibold text-[#49333F]">
                  Unlimited Services
                </p>
                <p className="text-xs text-[#987B88]">
                  Create as many services as you need.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-bold text-[#49333F]">
              <Receipt size={19} className="text-[#E477A0]" />
              Payment Details
            </h2>

            <div className="space-y-4 rounded-2xl border border-[#F0E2E7] p-5">

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#E477A0]" />
                  <span className="text-sm text-[#987B88]">
                    Payment Email
                  </span>
                </div>
                <span className="break-all text-right text-sm font-semibold text-[#49333F]">
                  {email}
                </span>
              </div>

              <div className="h-px bg-[#F5E9EE]" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-[#E477A0]" />
                  <span className="text-sm text-[#987B88]">
                    Amount Paid
                  </span>
                </div>
                <span className="text-lg font-bold text-[#E477A0]">
                  {amount}
                </span>
              </div>

              <div className="h-px bg-[#F5E9EE]" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-[#E477A0]" />
                  <span className="text-sm text-[#987B88]">
                    Payment Date
                  </span>
                </div>
                <span className="text-right text-sm font-medium text-[#49333F]">
                  {paymentDate}
                </span>
              </div>

              <div className="h-px bg-[#F5E9EE]" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Receipt size={18} className="text-[#E477A0]" />
                  <span className="text-sm text-[#987B88]">
                    Transaction ID
                  </span>
                </div>
                <span className="max-w-[190px] break-all text-right text-xs font-medium text-[#49333F]">
                  {session.id}
                </span>
              </div>

            </div>
          </div>

          {/* Continue Button */}
          <Link
            href="/dashboard/vendor/subscription"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E477A0] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#D96F96]"
          >
            Go to Subscription
            <ArrowRight size={18} />
          </Link>

          <p className="text-center text-xs text-[#987B88]">
            Thank you for choosing WedPlan. Enjoy your Premium experience!
          </p>
        </div>
      </div>
    </div>
  );
}
