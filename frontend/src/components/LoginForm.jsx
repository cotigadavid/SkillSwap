import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { Link } from "react-router-dom";

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
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            localStorage.setItem('userId', data["userId"]);
            console.log(data);

            navigate("/");
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
            <Link to="/reset-password">
              <button
                  type="button"
                  className="w-full py-3 mt-4 bg-yellow-300 text-lg font-medium rounded-md hover:bg-yellow-400 transition-colors"
              >
                  Forgot your password?
              </button>
            </Link>
        </div>
    );
};

export default LoginForm;