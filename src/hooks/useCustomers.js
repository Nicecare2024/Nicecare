import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingCustomer, setAddingCustomer] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    // Query flat /customers collection filtered by ownerUid
    const customersRef = collection(db, 'customers');
    const q = query(
      customersRef,
      where('ownerUid', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  async function addCustomer(customerData) {
    if (!currentUser) throw new Error('Not authenticated');

    setAddingCustomer(true);
    try {
      const customersRef = collection(db, 'customers');
      await addDoc(customersRef, {
        ...customerData,
        ownerUid: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error adding customer:', err);
      throw err;
    } finally {
      setAddingCustomer(false);
    }
  }

  async function updateCustomerStatus(customerId, newStatus) {
    if (!currentUser) throw new Error('Not authenticated');

    try {
      const customerRef = doc(db, 'customers', customerId);
      await updateDoc(customerRef, { status: newStatus });
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  }

  async function deleteCustomer(customerId) {
    if (!currentUser) throw new Error('Not authenticated');

    try {
      const customerRef = doc(db, 'customers', customerId);
      await deleteDoc(customerRef);
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  }

  return {
    customers,
    loading,
    error,
    addingCustomer,
    addCustomer,
    updateCustomerStatus,
    deleteCustomer,
  };
}
