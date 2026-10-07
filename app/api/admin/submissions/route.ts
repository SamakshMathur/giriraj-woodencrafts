import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { withErrorHandling } from "@/lib/api";
import { getSubmissions, updateSubmissionStatus, deleteSubmission } from "@/lib/submissions";

export const GET = withErrorHandling(async () => {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const submissions = await getSubmissions();
  return NextResponse.json({ submissions });
});

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const { id, status } = body ?? {};
  if (typeof id !== "string" || (status !== "new" && status !== "contacted")) {
    return NextResponse.json({ ok: false, error: "id and a valid status are required" }, { status: 400 });
  }
  await updateSubmissionStatus(id, status);
  return NextResponse.json({ ok: true });
});

export const DELETE = withErrorHandling(async (req: NextRequest) => {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  }
  await deleteSubmission(id);
  return NextResponse.json({ ok: true });
});
