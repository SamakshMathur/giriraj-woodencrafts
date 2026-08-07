import { getDb } from "./db";

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

type SubmissionDoc = Omit<Submission, "id"> & { _id: string };

const COLLECTION = "submissions";

function fromDoc({ _id, ...rest }: SubmissionDoc): Submission {
  return { id: _id, ...rest };
}

/** Newest first. */
export async function getSubmissions(): Promise<Submission[]> {
  const db = await getDb();
  const docs = await db
    .collection<SubmissionDoc>(COLLECTION)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(fromDoc);
}

export async function addSubmission(
  data: Omit<Submission, "id" | "createdAt" | "status">
): Promise<Submission> {
  const db = await getDb();
  const submission: Submission = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  const { id, ...rest } = submission;
  await db.collection<SubmissionDoc>(COLLECTION).insertOne({ _id: id, ...rest });
  return submission;
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
  const db = await getDb();
  await db.collection<SubmissionDoc>(COLLECTION).updateOne({ _id: id }, { $set: { status } });
}

export async function deleteSubmission(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<SubmissionDoc>(COLLECTION).deleteOne({ _id: id });
}
