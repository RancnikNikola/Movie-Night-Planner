import { useContext } from 'react';
import { UserContext } from '../../store/userContext/UserContext';
import { useParams } from 'react-router-dom';


import './userProfile.css';



const UserProfile = () => {

    const userCtx = useContext(UserContext);
    const { profileId } = useParams();

    console.log('PROFILE ID', profileId)

    if (userCtx.currentUser?.uid !== profileId) {
        return <h1>Error loading profile</h1>
    }

    return (
        <div>
            <h1>{userCtx.currentUser?.displayName}</h1>
            <h1>{userCtx.currentUser?.email}</h1>
            <img src={userCtx.currentUser?.photoURL} />
        </div>
    )
}

export default UserProfile;