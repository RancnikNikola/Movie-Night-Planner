import { useEffect, useState } from "react"
import { db } from "../utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";


const useUserDetails = (userIds) => {
    const [ userDetails, setUserDetails ] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (userIds.length === 0) {
                    setUserDetails([]);
                    return;
                } 

                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('uid', 'in', userIds));
                const querySnapshot = await getDocs(q);

                const users = querySnapshot.docs.map(doc => doc.data());
                setUserDetails(users);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        }

        fetchUserDetails();
    }, [userIds, db]);

    return userDetails;
    
}

export default useUserDetails;