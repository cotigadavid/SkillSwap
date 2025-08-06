import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import PasswordInput from "./PasswordInput";

const LoginForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        try {
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
        } catch (error) {
            console.error("Error logging in: ", error);
            alert("Failed to log in. Please try again.");
        }
    };
    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    }

    
    return (
        <div className="space-y-4">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
            <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
            />
            <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Log in
            </button>
        </div>
    );
};

export default LoginForm;