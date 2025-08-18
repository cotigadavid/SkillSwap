import { useState } from "react";

const ResetPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
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
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
            </div>
            <button
                type="submit"
                className="w-full py-3 mt-4 bg-yellow-300 text-lg font-medium rounded-md hover:bg-yellow-400 transition-colors"
            >
                Send Email
            </button>
        </form>
    );
};

export default ResetPassword;