import { getAuth } from "@react-native-firebase/auth";

const PROJECT_ID = "jbs-agri-hub";
const DATABASE_ID = "(default)";
const COLLECTION = "orders";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents`;

type FirestoreValue = {
  nullValue?: null;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  stringValue?: string;
  arrayValue?: { values: FirestoreValue[] };
  mapValue?: { fields: Record<string, FirestoreValue> };
};

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

function toFirestoreValue(value: unknown): FirestoreValue | undefined {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return undefined;
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value
          .map(toFirestoreValue)
          .filter((item): item is FirestoreValue => Boolean(item)),
      },
    };
  }
  if (typeof value === "object") {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      const encoded = toFirestoreValue(item);
      if (encoded) fields[key] = encoded;
    }
    return { mapValue: { fields } };
  }
  return undefined;
}

function fromFirestoreValue(value: FirestoreValue | undefined): unknown {
  if (!value) return undefined;
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("arrayValue" in value) {
    return (value.arrayValue?.values ?? []).map(fromFirestoreValue);
  }
  if ("mapValue" in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue?.fields ?? {}).map(([key, item]) => [
        key,
        fromFirestoreValue(item),
      ]),
    );
  }
  return undefined;
}

function fromFirestoreDocument(document: FirestoreDocument): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [
      key,
      fromFirestoreValue(value),
    ]),
  );
}

async function getIdToken(): Promise<string | null> {
  const user = getAuth().currentUser;
  if (!user) return null;
  return user.getIdToken();
}

async function request(
  path: string,
  init: RequestInit = {},
): Promise<Response | null> {
  const token = await getIdToken();
  if (!token) return null;

  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

export async function getFirestoreOrder(orderId: string) {
  const response = await request(`/${COLLECTION}/${encodeURIComponent(orderId)}`);
  if (!response) return null;
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore read failed: ${response.status}`);

  return fromFirestoreDocument(
    (await response.json()) as FirestoreDocument,
  );
}

export async function saveFirestoreOrder(
  orderId: string,
  data: Record<string, unknown>,
): Promise<boolean> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(data)) {
    const encoded = toFirestoreValue(value);
    if (encoded) fields[key] = encoded;
  }

  const response = await request(
    `/${COLLECTION}/${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ fields }),
    },
  );

  return Boolean(response?.ok);
}

export async function queryFirestoreOrdersByUser(userId: string) {
  const response = await request(":runQuery", {
    method: "POST",
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: COLLECTION }],
        where: {
          fieldFilter: {
            field: { fieldPath: "userId" },
            op: "EQUAL",
            value: { stringValue: userId },
          },
        },
      },
    }),
  });

  if (!response) return [];
  if (!response.ok) {
    throw new Error(`Firestore query failed: ${response.status}`);
  }

  const rows = (await response.json()) as Array<{
    document?: FirestoreDocument;
  }>;

  return rows
    .filter((row) => row.document)
    .map((row) => fromFirestoreDocument(row.document!));
}

export async function listFirestoreOrders() {
  const response = await request(`/${COLLECTION}`);
  if (!response) return [];
  if (!response.ok) {
    throw new Error(`Firestore list failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    documents?: FirestoreDocument[];
  };

  return (payload.documents ?? []).map(fromFirestoreDocument);
}

export function firestoreOrdersPath() {
  return `${BASE_URL}/${COLLECTION}`;
}
