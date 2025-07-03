import React, { useState } from 'react';
import toast, {Toaster} from 'react-hot-toast';

interface Props {
  onLoginSuccess: () => void;
}

const Login: React.FC<Props> = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error){
      toast.error(error);
    }
    try {
      const res = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token); 
      onLoginSuccess();
    } catch (err) {
      toast.error('Server error');
    }
  };

  const validate = () => 
    {
      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
      const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={};':"\\|,.<>?]).{6,20}$/;
   
      if(!emailPattern.test(loginData.email))
          return 'Enter the valid Email Id.';
  
      if(!passPattern.test(loginData.password))
          return 'Password must be 6-20 characters and include upper and lowercase , number, special character.';
   };

  return (
    <form onSubmit={handleSubmit}>
      
      <label id="email">Email :</label>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br></br><br></br>

      <label id="password">Password :</label>
      <input name="password" type="password" placeholder="Password"  minLength={6} maxLength={20} onChange={handleChange} required /><br></br><br></br>

      <button type="submit">Login</button>
      <Toaster />
    </form>
  );
};

export default Login;