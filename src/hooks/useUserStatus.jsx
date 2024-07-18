import { useState, useEffect } from 'react';
import { database } from '../utils/firebase';
import { ref, onValue } from 'firebase/database';

const useUserStatuses = () => {
  const [ userStatuses, setUserStatuses ] = useState({});

  useEffect(() => {
    const userStatusRef = ref(database, 'status');
    const unsubscribe = onValue(userStatusRef, (snapshot) => {
      setUserStatuses(snapshot.val() || {});
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return userStatuses;
};

export default useUserStatuses;
