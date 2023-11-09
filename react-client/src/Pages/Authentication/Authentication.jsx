import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { backend } from "../../AxiosInstances/BackendInstance";

// eslint-disable-next-line react/prop-types
function Authentication({ setAuthentication }) {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.mode);
  const navigate = useNavigate();

  const userNameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();

  useEffect(() => {
    const mode = params.get("mode");
    if (!(mode && (mode === "login" || mode === "register"))) {
      navigate("/authentication?mode=login");
    }
    setMode(mode);
  }, [params]);

  function authenticate(event) {
    event.preventDefault();

    const userCredentials = {
      userName: userNameRef.current.value,
      userEmail: emailRef.current.value,
      password: passwordRef.current.value,
    };

    if (mode === "login") {
      login(userCredentials);
    } else if (mode === "register") {
      register(userCredentials);
    }
  }

  function login(userCredentials) {
    console.log("trying to login the user");
    backend
      .post("/authentication/login", userCredentials)
      .then((response) => {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("token", token);
          setAuthentication(true);
          navigate("/chatbot");
        }
      })
      .catch((err) => {
        console.log("failed to login the user");
        setAuthentication(false);
        console.log(err);
      });
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
    // eslint-disable-next-line react/no-unknown-property
    <section className="h-screen w-screen flex" align="center">
      <div className="authentication-left bg-primary w-1/2 h-full">
        <div className="s-blob-main"> 
          <img className="hidden md:block w-40 s-blob-main-logo element-center ls-is-cached lazyloaded" src="https://xebia.com/apac/wp-content/uploads/sites/2/2021/11/XebiaLogo-white.svg" alt="xebia domains" data-src="https://xebia.com/apac/wp-content/uploads/sites/2/2021/11/XebiaLogo-white.svg" decoding="async" style={{height:"100vh", marginLeft:"40%"}}/>
        </div>
      </div>
      <div className="authentication-right bg-success w-1/2 flex justify-center items-center h-full">
        <div className="authenticate-form-container w-2/5">
          <h1 className="text-primary text-center text-3xl mb-7 capitalize font-medium">
            {mode}
          </h1>
          <form onSubmit={authenticate} className="flex flex-col gap-3 authenticate-form">
            <input
              ref={userNameRef}
              className="h-12 w-full rounded-lg pl-3 bg-secondary border-2 focus:outline-none focus:border-primary"
              placeholder="Username"
              type="text"
            />
            <input
              ref={emailRef}
              className="h-12 w-full rounded-lg pl-3 bg-secondary border-2 focus:outline-none focus:border-primary"
              placeholder="Email"
              type="email"
            />
            <input
              ref={passwordRef}
              className="h-12 w-full rounded-lg pl-3 bg-secondary border-2 focus:outline-none focus:border-primary"
              placeholder="Password"
              type="password"
            />
            <button className="w-full h-12 bg-primary text-secondary rounded-lg hover:bg-primary transition duration-300" type="submit">
              {mode}
            </button>
          </form>
          <p className="mt-5 text-gray-500">
            {mode === "login" ? (
              <span>
                New user?{" "}
                <Link to="/authentication?mode=register" className="text-primary">
                  Register
                </Link>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <Link to="/authentication?mode=login" className="text-primary">
                  Login
                </Link>
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Authentication;
