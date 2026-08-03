import { head, put } from "@vercel/blob";

const LIST_PATHNAME = "submissions/list.json";

export type SubmissionStatus = "new" | "contacted";

export type Submission = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  selections: Record<string, string>;
  note?: string;
  imageUrl?: string;
  status: SubmissionStatus;
};

async function readList(): Promise<Submission[]> {
  try {
    const { url } = await head(LIST_PATHNAME, { token: process.env.BLOB_READ_WRITE_TOKEN });
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as Submission[]) : [];
  } catch {
    return [];
  }
}

async function writeList(list: Submission[]): Promise<void> {
  await put(LIST_PATHNAME, JSON.stringify(list), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

/** Newest first. */
export async function getSubmissions(): Promise<Submission[]> {
  const list = await readList();
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addSubmission(
  data: Omit<Submission, "id" | "createdAt" | "status">
): Promise<Submission> {
  const list = await readList();
  const submission: Submission = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  list.push(submission);
  await writeList(list);
  return submission;
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
  const list = await readList();
  const submission = list.find((s) => s.id === id);
  if (!submission) return;
  submission.status = status;
  await writeList(list);
}

export async function deleteSubmission(id: string): Promise<void> {
  const list = await readList();
  await writeList(list.filter((s) => s.id !== id));
}
