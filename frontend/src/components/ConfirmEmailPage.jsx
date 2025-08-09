import { Link } from "react-router-dom";
import { CheckCircle } from 'lucide-react';

const ConfirmEmailPage = () => {

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Confirmed</h1>
                <p className="text-gray-600">
                    Your email has been successfully confirmed. 
                </p>
                <p>You can now log in to your account.</p>
                <Link to="/auth">
                <button style={{ padding: "10px 20px" }}>Go to Login</button>
                </Link>
            </div>
        </div>
    );

};

export default ConfirmEmailPage;