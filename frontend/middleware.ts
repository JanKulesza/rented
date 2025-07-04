import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export const config: MiddlewareConfig = {
  matcher: ["/app/:function*", "/me"],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("refreshToken")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
