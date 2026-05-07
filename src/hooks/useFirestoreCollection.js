import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, familyId } from '../firebase';

export function useFirestoreCollection(collectionName, sortField = 'createdAt') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState('');

  const collectionRef = useMemo(() => {
    if (!db) return null;
    return collection(db, 'homes', familyId, collectionName);
  }, [collectionName]);

  useEffect(() => {
    if (!collectionRef) return undefined;

    setLoading(true);
    const collectionQuery = query(collectionRef, orderBy(sortField, 'asc'));
    const unsubscribe = onSnapshot(
      collectionQuery,
      (snapshot) => {
        setItems(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [collectionRef, sortField]);

  const addItem = async (payload) => {
    if (!collectionRef) return;
    await addDoc(collectionRef, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const setItem = async (id, payload) => {
    if (!collectionRef) return;
    await setDoc(
      doc(collectionRef, id),
      {
        ...payload,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const updateItem = async (id, payload) => {
    if (!collectionRef) return;
    await updateDoc(doc(collectionRef, id), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  };

  const removeItem = async (id) => {
    if (!collectionRef) return;
    await deleteDoc(doc(collectionRef, id));
  };

  return {
    items,
    loading,
    error,
    addItem,
    setItem,
    updateItem,
    removeItem,
  };
}
