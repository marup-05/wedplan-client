
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const pathname = request.nextUrl.pathname;

  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);

    signInUrl.searchParams.set(
      "callbackURL",
      pathname + request.nextUrl.search
    );

    return NextResponse.redirect(signInUrl);
  }

  const { role, isBlocked } = session.user;

  if (isBlocked) {
    return NextResponse.redirect(
      new URL("/sign-in?error=blocked", request.url)
    );
  }

  if (pathname === "/dashboard") {
    const dashboardUrl = {
      admin: "/dashboard/admin",
      vendor: "/dashboard/vendor",
      customer: "/dashboard/customer",
    }[role];

    if (!dashboardUrl) {
      return NextResponse.redirect(
        new URL("/sign-in", request.url)
      );
    }

    return NextResponse.redirect(
      new URL(dashboardUrl, request.url)
    );
  }

  const requiredRole = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/vendor")
      ? "vendor"
      : pathname.startsWith("/dashboard/customer")
        ? "customer"
        : null;

  if (requiredRole && role !== requiredRole) {
    const dashboardUrl = {
      admin: "/dashboard/admin",
      vendor: "/dashboard/vendor",
      customer: "/dashboard/customer",
    }[role];

    return NextResponse.redirect(
      new URL(dashboardUrl || "/sign-in", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
