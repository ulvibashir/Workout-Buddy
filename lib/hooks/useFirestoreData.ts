"use client";
import { useState, useEffect } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const UID = "ulvi";

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

  return { data, loading };
}

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

  return { items, loading };
}
