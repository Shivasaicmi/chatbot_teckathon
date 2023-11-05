import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { backend } from "../../AxiosInstances/BackendInstance";

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

  function register(userCredentials) {
    console.log("trying to register the user");
    backend
      .post("/authentication/register", userCredentials)
      .then((response) => {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("token", token);
          setAuthentication(true);
          navigate("/chatbot");
        }
      })
      .catch((err) => {
        console.log("failed to register the user");
        setAuthentication(false);
        console.log(err);
      });
  }

  return (
    <section className="h-screen w-screen flex">
      <div className="authentication-left bg-purple-500 w-1/2 h-full"></div>
      <div className="authentication-right bg-gray-300 w-1/2 flex justify-center items-center h-full">
        <div className="authenticate-form-container w-2/5">
          <h1 className="text-purple-500 text-center text-3xl mb-7 capitalize font-medium">
            {mode}
          </h1>
          <form onSubmit={authenticate} className="flex flex-col gap-3 authenticate-form">
            <input
              ref={userNameRef}
              className="h-12 w-full rounded-lg pl-3 bg-white border-2 focus:outline-none focus:border-purple-500"
              placeholder="Username"
              type="text"
            />
            <input
              ref={emailRef}
              className="h-12 w-full rounded-lg pl-3 bg-white border-2 focus:outline-none focus:border-purple-500"
              placeholder="Email"
              type="email"
            />
            <input
              ref={passwordRef}
              className="h-12 w-full rounded-lg pl-3 bg-white border-2 focus:outline-none focus:border-purple-500"
              placeholder="Password"
              type="password"
            />
            <button className="w-full h-12 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300" type="submit">
              {mode}
            </button>
          </form>
          <p className="mt-5 text-gray-500">
            {mode === "login" ? (
              <span>
                New user?{" "}
                <Link to="/authentication?mode=register" className="text-purple-500">
                  Register
                </Link>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <Link to="/authentication?mode=login" className="text-purple-500">
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
