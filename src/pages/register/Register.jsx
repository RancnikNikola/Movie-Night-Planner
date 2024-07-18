import { useState } from 'react';
import { registerUser, storage, db } from '../../utils/firebase';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes,getDownloadURL } from 'firebase/storage';
import { getDoc, updateDoc, doc } from 'firebase/firestore';

import './register.css';


const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Register = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;
  const [ photoFile, setPhotoFile ] = useState(null);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('passwords do not match');
      return;
    }

    try {
      const { user } = await registerUser(email, password);

      const photoURL = URL.createObjectURL(photoFile);

      // Upload the user's image to Firebase Storage
      const storageRef = ref(storage, `user-images/${user.uid}/${photoFile.name}`);
      await uploadBytes(storageRef, photoFile);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName,
        photoURL: imageUrl,
        online: true
      });
      
      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Cannot create user, email already in use');
      } else {
        console.log('user creation encountered an error', error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleProfilePhoto = (event) => {
      const profileURL = event.target.files[0];
      setPhotoFile(profileURL);
  }

  console.log('PHOTOOO FILEE', photoFile);

  return (
    <div className='sign-up-container'>
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        {/* { photoFile && 
         <div className='input__image'>
          <img alt='Not Found' width={"250px"} src={URL.createObjectURL(photoFile)} />
          <br />
          <button onClick={() => setPhotoFile(null)}>Remove</button>
        </div>
        } */}
       
        <input
          type="file"
          onChange={handleProfilePhoto}
          placeholder="Profile Photo"
        />
        <input
          type='text'
          required
          onChange={handleChange}
          name='displayName'
          value={displayName}
        />

        <input
          type='email'
          required
          onChange={handleChange}
          name='email'
          value={email}
        />

        <input
          type='password'
          required
          onChange={handleChange}
          name='password'
          value={password}
        />

        <input
          type='password'
          required
          onChange={handleChange}
          name='confirmPassword'
          value={confirmPassword}
        />
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  );
};

export default Register;