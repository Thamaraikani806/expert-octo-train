import React, { useState } from 'react';
import toast,{Toaster} from 'react-hot-toast'

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address?: string;
}

const Register = () => {
  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const { firstName, lastName, password, confirmPassword, email } = formData;

    if (firstName.length < 3 || firstName.length > 30) {
      toast.error('First name must be 3-30 characters');
      return false;
    }
    if (lastName.length < 3 || lastName.length > 30) {
      toast.error('Last name must be 3-30 characters');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,20}$/;
    if (!passPattern.test(password)) {
      toast.error('Password must be 6-20 chars, include upper, lower, number, special char');
      return false;
    }
    const emailPattern = /^[^ ]+@[^]+\.[a-z]{2,3}$/;
    if(!emailPattern.test(email)) {
      toast.error('enter a valid email id.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        address: formData.address,
      };
      const res = await fetch('http://localhost:5000/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Registration failed');
        return;
      }
      toast.success('Registration successful!');
      setFormData({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '', address: '',  });
    } catch (err) {
      console.error(err);
      toast.error('Server error');
      }
  };

  return (
    <form onSubmit={handleSubmit}>

      <label id="firstName">Firstname :</label>
      <input name="firstName" placeholder="First Name" value={formData.firstName} minLength={3} maxLength={30} onChange={handleChange} required /><br></br><br></br>
      
      <label id="lastName">Lastname :</label>
      <input name="lastName" placeholder="Last Name" value={formData.lastName}  minLength={3} maxLength={30} onChange={handleChange} required /><br></br><br></br>

      <label id="email">Email id :</label>
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br></br><br></br>
      
      <label id="password">Password :</label>
      <input name="password" type="password" placeholder="Password" value={formData.password}  minLength={6} maxLength={20} onChange={handleChange} required /><br></br><br></br>
 
      <label id="confirmPassword">confirmPassword :</label>
      <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required /><br></br><br></br>
      
      <label id="address">Address :</label>
      <textarea name="address" placeholder="Address (optional)" value={formData.address} onChange={handleChange}></textarea><br></br><br></br>
       
      <button id="log" type="submit">Register</button>
      <Toaster/>
    </form>
  );
};

export default Register;