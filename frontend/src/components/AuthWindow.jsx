//import '../styling/AuthWindow.css';
import { useState } from "react";
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import logo from '../assets/Logo1024.png';
//import "../index.css"


const AuthWindow = () => {
    const [selected, setSelected] = useState('LogIn');

    // return (
    //     <div className='AuthWindow'>
    //         <figure><img src={logo} width="256" height="256" alt="Logo"></img></figure>
    //         <button type="button" id='log' 
    //             className={selected === 'LogIn' ? 'active' : ''} 
    //             onClick={() => setSelected('LogIn')}>Log in</button>
    //         <button type="button" id='sign'
    //             className={selected === 'SignUp' ? 'active' : ''} 
    //             onClick={() => setSelected("SignUp")}>Sign up</button>

    //         <div className='FormContainer'>
    //             {selected === 'LogIn' && <LoginForm/>}
    //             {selected === 'SignUp' && <SignupForm/>}
    //         </div>  
    //     </div>
    // );
   return (
    <div className="mt-24 bg-[#ffdbdb] py-8 text-center">
        <figure className="flex justify-center mb-6">
        <img src={logo} width="256" height="256" alt="Logo" />
        </figure>

        <div className="flex justify-center gap-4 mb-8">
        <button
            type="button"
            id="log"
            className={`w-2/5 max-w-[200px] h-12 text-lg rounded-md transition-colors duration-200 ${
            selected === 'LogIn'
                ? 'bg-[#007bff] text-white font-bold border-2 border-[#007bff]'
                : 'bg-gray-300 hover:bg-[#e0e0e0]'
            }`}
            onClick={() => setSelected('LogIn')}
        >
            Log in
        </button>

        <button
            type="button"
            id="sign"
            className={`w-2/5 max-w-[200px] h-12 text-lg rounded-md transition-colors duration-200 ${
            selected === 'SignUp'
                ? 'bg-[#007bff] text-white font-bold border-2 border-[#007bff]'
                : 'bg-gray-300 hover:bg-[#e0e0e0]'
            }`}
            onClick={() => setSelected('SignUp')}
        >
            Sign up
        </button>
        </div>

        <div className="w-full">
        {selected === 'LogIn' && <LoginForm />}
        {selected === 'SignUp' && <SignupForm />}
        </div>
    </div>
    );

};

export default AuthWindow;
