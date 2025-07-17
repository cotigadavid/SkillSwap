import '../styling/AuthWindow.css';
import './LoginForm'
import LoginForm from './LoginForm';
import './SignupForm'
import { useState } from "react";
import SignupForm from './SignupForm';


const AuthWindow = () => {
    const [selected, setSelected] = useState('LogIn');


    return (
        <div className='AuthWindow'>
            <figure><img src="/Logo1024.png" width="256" height="256" alt="Logo"></img></figure>
            <button type="button" onClick={() => setSelected('LogIn')}>Log in</button>
            <button type="button" onClick={() => setSelected("SignUp")}>Sign up</button>

            <div className='FormContainer'>
                {selected === 'LogIn' && <LoginForm/>}
                {selected === 'SignUp' && <SignupForm/>}
            </div>  
        </div>
    );
};

export default AuthWindow;
