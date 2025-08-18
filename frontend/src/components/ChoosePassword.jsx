import { Link } from "react-router-dom";
import { CheckCircle } from 'lucide-react';
import { useParams } from "react-router-dom";
import { useState } from "react";
import secureAxios from "../secureAxios";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const { uid, token } = useParams();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await secureAxios.post(`choose-password/${uid}/${token}/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword: password,
                })
            });
            const data = response.data;
            console.log(data);
        } catch (error) {
            console.error("Error resetting password: ", error);
            alert("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-600 flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center justify-center p-6 pb-4">
                    <h1 className="text-xl font-semibold text-gray-900">Reset Your Password</h1>
                </div>
                
                <div className="px-6 pb-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
                        >
                            Reset Password
                        </button>
                    </form>
                    
                    <div className="flex justify-center mt-6">
                        <Link to="/auth">
                            <button
                                type="button"
                                className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-all duration-200"
                            >
                                Back to Login
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;