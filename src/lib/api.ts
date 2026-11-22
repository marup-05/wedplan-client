
"use client";

import { authClient } from "@/lib/auth-client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getAuthHeaders = async (json = true) => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  return {
    ...(json && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${data.token}`,
  };
};
