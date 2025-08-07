import { Link } from "react-router-dom";
import { CheckCircle } from 'lucide-react';
import { useParams } from "react-router-dom";
import { useState } from "react";

const ConfirmEmailPage = () => {
    const [password, setPassword] = useState('');

    const { uid, token } = useParams();

    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:8000/api/choose-password/${uid}/${token}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newPassword: password,
            })
        })

        const data = response.json();
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">New Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
            </div>
            <button
                type="submit"
                className="w-full py-3 mt-4 bg-yellow-300 text-lg font-medium rounded-md hover:bg-yellow-400 transition-colors"
            >
                Reset your password
            </button>
        </form>
    );

};

export default ConfirmEmailPage;