import { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AuthContext from '../../store/auth/auth.context';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../utils/firebase.utils';


const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch({ type: 'SET_USER', payload: user });

      // Set user status to 'online'
      await updateDoc(doc(db, 'users', user.uid), { online: true });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
