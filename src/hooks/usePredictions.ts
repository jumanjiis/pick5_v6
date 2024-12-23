import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const usePredictions = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const selectionsRef = collection(db, 'predictions');
        const selectionsQuery = query(
          selectionsRef,
          where('userId', '==', user.uid)
        );
        const selectionsSnapshot = await getDocs(selectionsQuery);
        const selectionsData = selectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPredictions(selectionsData);
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError('Failed to load predictions');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [user]);

  return { predictions, loading, error };
};