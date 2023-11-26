import { useEffect, useState } from "react";
import "./App.css";
import { backend } from "./AxiosInstances/BackendInstance.js";
// import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import Authentication from "./Pages/Authentication/Authentication";
import ChatPage from "./Pages/Chat/ChatPage.jsx";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak.js";
import PrivateRoute from "./PrivateRoute";
import HomePage from "./Pages/HomePage/Homepage.jsx";

function App() {
  // const navigate = useNavigate();
  // const [isAuthenticated,setIsAuthenticated] = useState(false);

  // useEffect(()=>{
  //     const token = localStorage.getItem('token');
  //     if(token){
  //       backend.post('/istokenvalid',null,{
  //         headers:{
  //           Authorization:`Bearer ${token}`
  //         }
  //       }).then((response)=>{
  //         if(response.data.authenticated){
  //           setIsAuthenticated(true);
  //           navigate('/chatbot')
  //         }
  //         else{
  //           localStorage.removeItem('token');
  //           setIsAuthenticated(false);
  //           navigate('/authentication',{
  //             mode:'login'
  //           });
  //         }
  //       }).catch(err=>{
  //         console.log(err);
  //         if(err.response && !err.response.authenticated){
  //           localStorage.removeItem('token');
  //           setIsAuthenticated(false);
  //           navigate('/authentication',{
  //             mode:'login'
  //           });
  //         }
  //       })
  //     }
  //     else{
  //       setIsAuthenticated(false);
  //       navigate('/authentication?mode=login');
  //     }

  // },[])
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/abc">
            <>hii</>
          </Route>
          <Route path="/chatbot">
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          </Route>
        </Switch>
      </Router>
    </ReactKeycloakProvider>
  );
}

export default App;
