import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

function Authentication() {

    const [params,setParams] = useSearchParams();
    const [mode,setMode] = useState(params.mode);
    const navigate = useNavigate();

    useEffect(()=>{
        const mode = params.get('mode');
        if(!(mode&&(mode==='login'||mode==='register'))){
            navigate('/authentication?mode=login')
        }
        setMode(mode);
    },[])

  return (
    <section className="h-screen w-screen flex" >
        <div className="authentication-left bg-black w-[50%] h-full ">
            <h1></h1>
        </div>
        <div className="authentication-right bg-white w-[50%] flex justify-center items-center h-full">
                <div className="authenticate-form-container">
                    <h1> {mode} </h1>
                    <form action="" className="flex flex-col authenticateform " >
                        <input className="border border-black-1" type="text" />
                        <input className="border border-black-1" type="email" />
                        <input className="border border-black-1" type="password" />
                        <button className="w-full h-10 bg-black text-white" type="submit" >  {mode} </button>
                    </form>
                    <span>
                        {
                            mode==='login'? <p>New user? <Link to='/authentication?mode=register' >Register</Link> </p> : <p>Already have an account ? <Link to='/authentication?mode=login' >Login</Link> </p>
                        }
                    </span>
                </div>
        </div>
    </section>
  )
}

export default Authentication;