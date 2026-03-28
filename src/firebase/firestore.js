import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export const getCollection = async (collectionName) => {
  const ref = collection(db, collectionName);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addDocument = async (collectionName, data) => {
  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, data);
  return docRef.id;
};

export const deleteDocument = async (collectionName, id) => {
  const ref = doc(db, collectionName, id);
  await deleteDoc(ref);
};

export const updateDocument = async (collectionName, id, data) => {
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, data);
};
