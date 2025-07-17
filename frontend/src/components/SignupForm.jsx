import '../styling/SignupForm.css';
import { useState } from "react";

const SignupForm = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState('false')

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
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
                    <label>Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
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
                
                <button type="submit" className='submitButton'>Sign up</button>
            </form>
        </div>
    );
};

export default SignupForm;