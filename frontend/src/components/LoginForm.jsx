import '../styling/LoginForm.css';
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

    return (
        <div className='LoginForm'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showPassword={showPassword}
                        toggleShowPassword={toggleShowPassword}
                    />
                </div>
                <button type="submit" className='submitButton'>Log in</button>
            </form>
        </div>
    );
};

export default LoginForm;