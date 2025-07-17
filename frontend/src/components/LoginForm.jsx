import '../styling/LoginForm.css';
import { useState } from "react";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState('false');

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
                    <div className='passCont'>
                        <input
                            id='pass'
                            type={showPassword ? 'password' : 'text'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type='button' id='eye' onClick={toggleShowPassword}>
                        <img src={showPassword ? "/eye.png" : "/eye_closed.png"} width='20' height='20'/>
                        </button>
                    </div>
                </div>
                <button type="submit" className='submitButton'>Login</button>
            </form>
        </div>
    );
};

export default LoginForm;