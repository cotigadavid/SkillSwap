import '../styling/LoginForm.css';
import { useState } from "react";
import PasswordInput from './PasswordInput';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);
    };

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <div className='LoginForm'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showPassword={showPassword}
                        toggleShowPassword={toggleShowPassword}
                    />
                </div>
                <button type="submit" className='submitButton'>Log in</button>
            </form>
        </div>
    );
};

export default LoginForm;