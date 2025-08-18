import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}reset-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                })
            });
            const data = await response.json();
            
            if (response.ok) {
                setIsSubmitted(true);
            } else {
                alert(data?.detail || "Failed to send reset email.");
            }
        } catch (error) {
            console.error("Error sending reset email: ", error);
            alert("Failed to send reset email. Please try again.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-600 flex items-center justify-center p-4 relative">
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 animate-in fade-in-0 zoom-in-95">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Check Your Email</h1>
                        <p className="text-gray-600 mb-2">
                            We've sent a password reset link to:
                        </p>
                        <p className="text-gray-900 font-medium mb-6">
                            {email}
                        </p>
                        
                        <Link to="/auth" className="w-full">
                            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                                Back to Login
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
                        >
                            Send Reset Email
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

export default ResetPassword;