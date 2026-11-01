// app/api/inquiry/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
const Inquiry = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).optional(),
  industry: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0).optional(), // honeypot, real users leave it empty
});
// simple in-memory limiter, use Redis if there is more than one server
const hits = new Map<string, { count: number; reset: number }>();
function tooMany(ip: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  h.count += 1;
  return h.count > max;
}
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && !["https://www.cynbit.in", "https://cynbit.in"].includes(origin)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }
  const parsed = Inquiry.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 202 }); // bot, ignore quietly
  }
  // 1. save to database  2. add a job to send the notification email
  return NextResponse.json({ ok: true }, { status: 202 });
