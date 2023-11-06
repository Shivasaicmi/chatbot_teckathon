import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {backend} from "../../AxiosInstances/BackendInstance";

// eslint-disable-next-line react/prop-types
function Authentication({setAuthentication}) {

    const [params] = useSearchParams();
    const [mode,setMode] = useState(params.mode);
    const navigate = useNavigate();

    const userNameRef = useRef();
    const passwordRef = useRef();
    const emailRef = useRef();


    useEffect(()=>{
        const mode = params.get('mode');
        if(!(mode&&(mode==='login'||mode==='register'))){
            navigate('/authentication?mode=login')
        }
        setMode(mode);
    },[params]);

    function authenticate(event){
        event.preventDefault();

        const userCredentials = {
            userName:userNameRef.current.value,
            userEmail:emailRef.current.value,
            password:passwordRef.current.value
        }

        if(mode==='login'){
            login(userCredentials)
        }
        else if(mode==='register') {
            register(userCredentials);
        }
        
    }

    function login(userCredentials){
        console.log("trying to login the user");
        backend.post('/authentication/login',userCredentials).then((response)=>{
            const token = response.data.token;
            if(token){
                localStorage.setItem('token',token);
                setAuthentication(true);
                navigate('/chatbot');
            }
        }).catch((err)=>{
            console.log("failed to login the user");
            setAuthentication(false);
            console.log(err);
        })

    }

    function register(userCredentials){
        console.log("trying to register the user");
        backend.post('/authentication/register',userCredentials).then((response)=>{
            const token = response.data.token;
            if(token){
                localStorage.setItem('token',token);
                setAuthentication(true)
                navigate('/chatbot')
            }
        }).catch((err)=>{
            console.log("failed to regsiter the user");
            setAuthentication(false);
            console.log(err);
            
        })
    }

  return (
    <section className="h-screen w-screen flex" >
        <div className="authentication-left bg-black w-[50%] h-full ">
            <h1></h1>
        </div>
        <div className="authentication-right bg-white w-[50%] flex justify-center items-center h-full">
                <div className="authenticate-form-container w-[40%] ">
                    <h1 className="text-black text-center text-[3rem] mb-7 capitalize font-medium " > {mode} </h1>
                    <form onSubmit={authenticate} className="flex flex-col gap-2 authenticateform " >
                        <input ref={userNameRef} className=" h-10 w-full rounded-lg pl-3 bg-white border-2 " placeholder="username" type="text" />
                        <input ref={emailRef} className=" h-10 w-full rounded-lg pl-3 bg-white border-2" placeholder="email" type="email" />
                        <input ref={passwordRef} className=" h-10 w-full rounded-lg pl-3 bg-white border-2" placeholder="password" type="password" />
                        <button className="w-full h-10 bg-black text-white" type="submit" >  {mode} </button>
                    </form>
                    <span className="mt-5 block" >
                        {
                            mode==='login'? <p className="text-gray-500" >New user? <Link to='/authentication?mode=register' className="text-black" >Register</Link> </p> : <p className="text-gray-500">Already have an account ? <Link to='/authentication?mode=login' >Login</Link> </p>
                        }
                    </span>
                </div>
        </div>
    </section>
  )
}

export default Authentication;