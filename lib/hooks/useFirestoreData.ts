"use client";
import { useState, useEffect, useCallback } from "react";
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const UID = "ulvi"; // fixed user — no auth needed

// Single document: users/ulvi/{col}/{docId}
export function useFirestoreDoc<T>(
  collectionName: string,
  docId: string,
  defaultValue: T
) {
  const [data, setData] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const local = localStorage.getItem(`${collectionName}__${docId}`);
      return local ? JSON.parse(local) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  const [loading, setLoading] = useState(true);

  const docPath = `users/${UID}/${collectionName}/${docId}`;

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, docPath),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data() as T;
          setData(d);
          localStorage.setItem(`${collectionName}__${docId}`, JSON.stringify(d));
        }
        setLoading(false);
      },
      (e) => { console.error(`[Firestore] snapshot error ${docPath}:`, e); setLoading(false); }
    );
    return unsub;
  }, [docPath, collectionName, docId]);

  const save = useCallback(
    async (value: T) => {
      setData(value);
      localStorage.setItem(`${collectionName}__${docId}`, JSON.stringify(value));
      try {
        await setDoc(doc(db, docPath), value as object, { merge: true });
      } catch (e) {
        console.error(`[Firestore] write failed ${docPath}:`, e);
      }
    },
    [docPath, collectionName, docId]
  );

  return { data, loading, save };
}

// Collection: users/ulvi/{col}/{id}
export function useFirestoreCollection<T extends { id: string }>(
  collectionName: string
) {
  const [items, setItems] = useState<T[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const local = localStorage.getItem(`col__${collectionName}`);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, `users/${UID}/${collectionName}`);
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
        setItems(docs);
        localStorage.setItem(`col__${collectionName}`, JSON.stringify(docs));
        setLoading(false);
      },
      (e) => { console.error(`[Firestore] collection snapshot error ${collectionName}:`, e); setLoading(false); }
    );
    return unsub;
  }, [collectionName]);

  const upsert = useCallback(
    async (item: T) => {
      const next = items.some((i) => i.id === item.id)
        ? items.map((i) => (i.id === item.id ? item : i))
        : [...items, item];
      setItems(next);
      localStorage.setItem(`col__${collectionName}`, JSON.stringify(next));
      try {
        const { id, ...rest } = item;
        await setDoc(
          doc(db, `users/${UID}/${collectionName}/${id}`),
          rest,
          { merge: true }
        );
      } catch (e) {
        console.error(`[Firestore] upsert failed ${collectionName}/${item.id}:`, e);
      }
    },
    [collectionName, items]
  );

  const remove = useCallback(
    async (id: string) => {
      const next = items.filter((i) => i.id !== id);
      setItems(next);
      localStorage.setItem(`col__${collectionName}`, JSON.stringify(next));
      try {
        await deleteDoc(doc(db, `users/${UID}/${collectionName}/${id}`));
      } catch (e) {
        console.error(`[Firestore] delete failed ${collectionName}/${id}:`, e);
      }
    },
    [collectionName, items]
  );

  return { items, loading, upsert, remove };
}
