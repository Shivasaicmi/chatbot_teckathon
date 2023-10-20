
import { useEffect, useState } from 'react'
import './App.css'
import { backend } from './AxiosInstances/AxiosInstance.js';
import { useNavigate, Routes,Route } from 'react-router-dom';
import Authentication from './Pages/Authentication/Authentication';
import ChatPage from './Pages/Chat/ChatPage';

function App() {

  const navigate = useNavigate();
  const [isAuthenticated,setIsAuthenticated] = useState(false);

  useEffect(()=>{
      const token = localStorage.getItem('token');
      if(token){
        backend.post('/istokenvalid').then((response)=>{
          if(response.data.authenticated){
            setIsAuthenticated(true);
          }
          else{
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
      {
        isAuthenticated? 
        <Routes>
            <Route path='/authentication' element={<Authentication/>} />
            <Route path='/chatbot' element={<ChatPage/>} />
        </Routes>
        :
        <Routes>
            <Route path='/authentication' element={<Authentication/>} />
        </Routes>
      }
   </>
  )
}

export default App
