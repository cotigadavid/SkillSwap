import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { Link } from "react-router-dom";
import secureAxios from "../secureAxios";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Username:', username);
            console.log('Password:', password);

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}token/`, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('Login successful:', data);
            
            localStorage.setItem('userId', data["userId"]);
            
            window.dispatchEvent(new Event('storage'));

            navigate("/");
            
        } catch (error) {
            console.error("Error logging in: ", error);
            alert("Failed to log in. Please check your credentials and try again.");
        } finally {
            setIsLoading(false);
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
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
                disabled={isLoading}
            />
            <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading || !username || !password}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {isLoading ? 'Logging in...' : 'Log in'}
            </button>
            <Link to="/reset-password" className="block">
                <button
                    type="button"
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-gray-50 text-teal-500 hover:text-teal-600 border border-teal-500 hover:border-teal-600 font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    Forgot your password?
                </button>
            </Link>
        </div>
    );
};

export default LoginForm;