import { NextResponse, type NextRequest } from "next/server";

/**
 * Wraps a route handler so an unexpected failure (most often the database
 * being unreachable) returns a clear JSON error instead of a blank 500.
 * The real error is logged, so it shows up in Cloudflare's Observability logs.
 */
export function withErrorHandling<A extends unknown[]>(
  handler: (...args: A) => Promise<Response>
): (...args: A) => Promise<Response> {
  return async (...args: A) => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error("API error:", err);
      return NextResponse.json(
        {
          ok: false,
          error: "The service is temporarily unavailable. Please try again in a minute, or message us on WhatsApp.",
        },
        { status: 503 }
      );
    }
  };
}

/** The visitor's IP address, as reported by Cloudflare (or a local proxy in dev). */
export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function tooManyRequests(message: string): Response {
  return NextResponse.json({ ok: false, error: message }, { status: 429 });
}
