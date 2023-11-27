
import { useEffect, useState } from 'react'
import './App.css'
import { backend } from './AxiosInstances/BackendInstance.js';
import { useNavigate, Routes,Route, Navigate } from 'react-router-dom';
import Authentication from './Pages/Authentication/Authentication';
import ChatPage from './Pages/Chat/ChatPage.jsx';

function App() {

  const navigate = useNavigate();
  const [isAuthenticated,setIsAuthenticated] = useState(false);

  useEffect(()=>{
      const token = localStorage.getItem('token');
      if(token){
        backend.post('/istokenvalid',null,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        }).then((response)=>{
          if(response.data.authenticated){
            setIsAuthenticated(true);
            navigate('/chatbot')
          }
          else{
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            navigate('/authentication',{
              mode:'login'
            });
          }
        }).catch(err=>{
          console.log(err);
          if(err.response && !err.response.authenticated){
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            navigate('/authentication',{
              mode:'login'
            });
          }
        })
      }
      else{
        setIsAuthenticated(false);
        navigate('/authentication?mode=login');
      }
     
  },[])
  return (
    <>
     
        <Routes>
            <Route path='/authentication' element={<Authentication setAuthentication={setIsAuthenticated} />} />
            <Route path='/chatbot' element={ 
              isAuthenticated? 
              <ChatPage />:
              <Navigate to="/authentication?mode=login"  />
            
            } />
        </Routes>
        
   </>
  )
}

export default App
