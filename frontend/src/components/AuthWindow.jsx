
import { useState } from "react";
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import logo from '../assets/Logo1024.png';
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";



const AuthWindow = () => {
    const [selected, setSelected] = useState('LogIn');

    const logo = "https://via.placeholder.com/80x80/10b981/ffffff?text=W";

     return (
        <div className="min-h-screen bg-gray-600 flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center justify-center p-6 pb-4">
                    <h1 className="text-xl font-semibold text-gray-900">Welcome to SkillSwap!</h1>
                </div>

                <div className="px-6 pb-6">
                    <div className="animate-in fade-in-0 slide-in-from-right-1 duration-300">
                        {selected === 'LogIn' && <LoginForm />}
                        {selected === 'SignUp' && <SignupForm />}
                    </div>
                    
                    <div className="flex justify-center mt-6 space-x-8">
                        <button
                            type="button"
                            onClick={() => setSelected('LogIn')}
                            className={`text-sm font-medium transition-all duration-200 ${
                                selected === 'LogIn'
                                    ? 'text-gray-700 border-b-2 border-gray-700 pb-1'
                                    : 'text-teal-500 hover:text-teal-600'
                            }`}
                        >
                            Log in
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelected('SignUp')}
                            className={`text-sm font-medium transition-all duration-200 ${
                                selected === 'SignUp'
                                    ? 'text-gray-700 border-b-2 border-gray-700 pb-1'
                                    : 'text-teal-500 hover:text-teal-600'
                            }`}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthWindow;
