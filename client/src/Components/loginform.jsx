import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!username) {
        errors.username = 'Username is required';
    } else if (username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
};

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        axios.post('https://socket-io-e3s4.onrender.com/login', {username , password})
          .then((res)=>{
            toast.success('Login Successful' , {duration: 1000})
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('id', res.data.id)
            sessionStorage.setItem('loggedin' , true)
            setTimeout(()=>{
              navigate('/chatinterface');
            },1200)
          })
          .catch((err)=>{
            toast.error('Login Failed')
            console.log(err)
          })
    } else {
      toast.error('Form validation failed')
        console.log('Form validation failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-white text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col items-center">
            <label htmlFor="username" className="self-start text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 px-3 py-2 bg-gray-700 text-white rounded-md w-full"
              autoComplete='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
            />
             {errors.username && <span className="text-red-500 text-sm mt-1 block">{errors.username}</span>}
          </div>
          <div className="mb-6 flex flex-col items-center">
            <label htmlFor="password" className="self-start text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 px-3 py-2 bg-gray-700 text-white rounded-md w-full"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>}
          </div>
            <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                Login
            </button>
        </form>
        <p className="text-gray-300 mt-4">
          New user?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-600">
            Register
          </Link>
        </p>
      </div>

      <Toaster
  position="top-center"
  reverseOrder={true}
/>
    </div>
  );
};

export default LoginForm;
