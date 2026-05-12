"use client";
import { useState, useEffect, useCallback } from "react";
import { doc, setDoc, collection, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const UID = "ulvi";

// Single document: users/ulvi/{collectionName}/{docId}
export function useFirestoreDoc<T>(
  collectionName: string,
  docId: string,
  defaultValue: T
) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  const docPath = `users/${UID}/${collectionName}/${docId}`;

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, docPath),
      (snap) => {
        setData(snap.exists() ? (snap.data() as T) : defaultValue);
        setLoading(false);
      },
      (e) => {
        console.error(`[Firestore] ${docPath}:`, e.message);
        setLoading(false);
      }
    );
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docPath]);

  const save = useCallback(
    async (value: T) => {
      setData(value);
      try {
        await setDoc(doc(db, docPath), value as object, { merge: true });
      } catch (e: any) {
        console.error(`[Firestore] write ${docPath}:`, e.message);
      }
    },
    [docPath]
  );

  return { data, loading, save };
}

// Collection: users/ulvi/{collectionName}/{item.id}
export function useFirestoreCollection<T extends { id: string }>(
  collectionName: string
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `users/${UID}/${collectionName}`),
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
        setLoading(false);
      },
      (e) => {
        console.error(`[Firestore] ${collectionName}:`, e.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [collectionName]);

  const upsert = useCallback(
    async (item: T) => {
      const { id, ...rest } = item;
      setItems((prev) =>
        prev.some((i) => i.id === id)
          ? prev.map((i) => (i.id === id ? item : i))
          : [...prev, item]
      );
      try {
        await setDoc(doc(db, `users/${UID}/${collectionName}/${id}`), rest, { merge: true });
      } catch (e: any) {
        console.error(`[Firestore] upsert ${collectionName}/${id}:`, e.message);
      }
    },
    [collectionName]
  );

  const remove = useCallback(
    async (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      try {
        await deleteDoc(doc(db, `users/${UID}/${collectionName}/${id}`));
      } catch (e: any) {
        console.error(`[Firestore] delete ${collectionName}/${id}:`, e.message);
      }
    },
    [collectionName]
  );

  return { items, loading, upsert, remove };
}
