//import '../styling/LoginForm.css';
import { useState } from "react";
import PasswordInput from './PasswordInput';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);

        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        const decoded = jwtDecode(data.access);
        const userId = decoded.user_id;

        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('userId', userId);

        console.log(data);

        navigate(-1);
    };

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    }

    // return (
    //     <div className='LoginForm'>
    //         <form onSubmit={handleSubmit}>
    //             <div>
    //                 <label>Username</label>
    //                 <input
    //                     type="text"
    //                     value={username}
    //                     onChange={(e) => setUsername(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>Password</label>
    //                 <PasswordInput
    //                     value={password}
    //                     onChange={(e) => setPassword(e.target.value)}
    //                     showPassword={showPassword}
    //                     toggleShowPassword={toggleShowPassword}
    //                 />
    //             </div>
    //             <button type="submit" className='submitButton'>Log in</button>
    //         </form>
    //     </div>
    // );
    return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 mt-4 bg-yellow-300 text-lg font-medium rounded-md hover:bg-yellow-400 transition-colors"
      >
        Log in
      </button>
    </form>
  );

};

export default LoginForm;