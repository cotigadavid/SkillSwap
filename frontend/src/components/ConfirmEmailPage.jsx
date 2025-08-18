import { Link } from "react-router-dom";
import { CheckCircle } from 'lucide-react';

const ConfirmEmailPage = () => {
    return (
        <div className="min-h-screen bg-gray-600 flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 animate-in fade-in-0 zoom-in-95">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <CheckCircle className="text-green-500 mb-6" size={64} />
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Email Confirmed!</h1>
                    <p className="text-gray-600 mb-2">
                        Your email has been successfully confirmed.
                    </p>
                    <p className="text-gray-600 mb-6">
                        You can now log in to your account.
                    </p>
                    
                    <Link to="/auth" className="w-full">
                        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                            Go to Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ConfirmEmailPage;