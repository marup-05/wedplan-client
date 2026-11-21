
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.BETTER_AUTH_URL;

    const userSession = await auth.api.getSession({
      headers: headersList,
    });

    if (!userSession || userSession.user.role !== "vendor") {
      return NextResponse.redirect(
        new URL("/sign-in", origin),
        303
      );
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1UeIBFJKiHlDtBbm4ziZrW1J",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userSession.user.email,
      metadata: {
        vendorId: userSession.user.id,
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/vendor/subscription`,
    });

    if (!session.url) {
      throw new Error("Stripe Checkout URL was not generated");
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
