import { NextRequest, NextResponse } from "next/server";
import { deleteImage, uploadImage, imageUrl as toImageUrl, validateImageFile } from "@/lib/images";
import { addSubmission } from "@/lib/submissions";
import { clientIp, tooManyRequests, withErrorHandling } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rateLimit";

// Public endpoint: any site visitor can send an enquiry (Customization or
// Contact page). No login, so every input is validated and capped, and each
// visitor is limited to a handful of enquiries per hour to stop scripts from
// filling the database.

const MAX_TEXT_LENGTH = 2000;
const MAX_NAME_LENGTH = 200;
const MAX_PHONE_LENGTH = 40;
const SUBMISSIONS_PER_HOUR = 8;

function clip(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** 7 to 15 digits, allowing spaces, dashes, brackets and a leading "+". */
function isValidPhone(phone: string): boolean {
  if (!/^[+\d\s\-().]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export const POST = withErrorHandling(async (req: NextRequest) => {
  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const name = clip(form.get("name"), MAX_NAME_LENGTH);
  const phone = clip(form.get("phone"), MAX_PHONE_LENGTH);
  const email = clip(form.get("email"), MAX_NAME_LENGTH);
  const note = clip(form.get("note"), MAX_TEXT_LENGTH);
  const selectionsRaw = clip(form.get("selections"), MAX_TEXT_LENGTH);
  const file = form.get("file");
  const via = form.get("via") === "whatsapp" ? "whatsapp" : "form";

  // Both enquiry forms on the site require these, so the team can always
  // call back even if the visitor never presses send in WhatsApp.
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "Name and phone are required" }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid phone number." },
      { status: 400 }
    );
  }

  const selections: Record<string, string> = {};
  if (selectionsRaw) {
    try {
      const parsed = JSON.parse(selectionsRaw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [key, value] of Object.entries(parsed).slice(0, 10)) {
          if (typeof value === "string") selections[key.slice(0, 40)] = value.slice(0, 100);
        }
      }
    } catch {
      // Ignore malformed selections; the rest of the enquiry is still useful.
    }
  }

  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    const problem = validateImageFile(file);
    if (problem) return NextResponse.json({ ok: false, error: problem }, { status: 400 });
  }

  const { allowed } = await consumeRateLimit(`submission:${clientIp(req)}`, SUBMISSIONS_PER_HOUR, 60 * 60);
  if (!allowed) {
    return tooManyRequests(
      "You've sent several enquiries already. Please message us directly on WhatsApp instead."
    );
  }

  let fileId;
  if (hasFile) {
    const id = `submission-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    fileId = await uploadImage(file, id, file.type);
  }
  const imageUrl = fileId ? toImageUrl(fileId) : undefined;

  try {
    const submission = await addSubmission({
      name,
      phone,
      email: email || undefined,
      selections,
      note: note || undefined,
      imageUrl,
      via,
    });
    return NextResponse.json({ ok: true, id: submission.id, imageUrl });
  } catch (err) {
    // Don't leave an orphaned photo behind if the enquiry itself didn't save.
    if (fileId) await deleteImage(fileId);
    throw err;
  }
});
