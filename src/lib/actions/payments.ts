
"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const checkoutVerify = async (sessionId: string) => {
  const headersList = await headers();

  const tokenData = await auth.api.getToken({
    headers: headersList,
  });

  const res = await fetch(`${BASE_URL}/payments/checkout-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.token}`,
    },
    body: JSON.stringify({ sessionId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Payment verification failed");
  }

  return data;
};
