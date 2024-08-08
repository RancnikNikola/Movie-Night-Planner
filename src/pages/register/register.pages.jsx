import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../../utils/firebase.utils';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';



const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [ photoURL, setPhotoURL ] = useState('');

  const handleProfilePhoto = (event) => {
    const profileURL = event.target.files[0];
    setPhotoURL(profileURL);
  };

  const handleRegister = async () => {
    if (password !== repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const storageRef = ref(storage, `userImages/${user.uid}/profileImg`);
      await uploadBytes(storageRef, photoURL);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);

      // Update profile with displayName and photoURL
      await updateProfile(user, { displayName, imageUrl });

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        imageUrl,
        email,
        online: true,
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      <input
          type="file"
          onChange={handleProfilePhoto}
          placeholder="Profile Photo"
        />      
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="password" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
