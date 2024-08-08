import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../store/auth/auth.context';
import './user-profile.css';

const UserProfile = () => {

    const { state} = useContext(AuthContext);
    const { profileId } = useParams();

    console.log('PROFILE ID', profileId)

    if (state.user?.uid !== profileId) {
        return <h1>Error loading profile</h1>
    }

    return (
        <div>
            <h1>{state.user?.displayName}</h1>
            <h1>{state.user?.email}</h1>
            <img src={state.user?.photoURL} />
        </div>
    )
}

export default UserProfile;