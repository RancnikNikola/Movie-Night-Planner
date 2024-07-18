

import { useContext, useState } from 'react';
import { loginUser } from '../../utils/firebase';
import { UserContext } from '../../store/userContext/UserContext';
import './login.css';


const defaultFormFields = {
    email: '',
    password: '',
  };

export default function Login() {
    const [ formFields, setFormFields ] = useState(defaultFormFields);
    const { email, password } = formFields;

    const userCtx = useContext(UserContext);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
      };
    
      const handleLogin = async (event) => {
        event.preventDefault();
    
        try {    
          await loginUser(email, password);
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

    return (
    <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {/* {error && <p>{error}</p>} */}
        <div>
            <label>Email:</label>
            <input
             type='email'
             required
             onChange={handleChange}
             name='email'
             value={email}
            />
        </div>
        <div>
            <label>Password:</label>
            <input
           type='password'
           required
           onChange={handleChange}
           name='password'
           value={password}
            />
        </div>
        <button type="submit">Login</button>
    </form>
    )
}