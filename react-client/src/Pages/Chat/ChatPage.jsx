/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
function ChatPage() {

  const navigate = useNavigate();

  const inputRef = useRef(null);
  const chatNameRef = useRef(null);
  const roomNameRef = useRef(null);

  const token = localStorage.getItem('token');

  const [socket] = useState(()=>{
	console.log("setting the socket ");

	return io('http://localhost:8080/chat',{auth:{token:token?token:null}})
  });
  const [messages,setMessages] = useState([]);

  const [chatHistory,setChatHistory] = useState([]); 

  const [currentRoomId,setCurrentRoomId] = useState(null);

  useEffect(()=>{

    function connectToChatSession(){
      const token = localStorage.getItem('token');
      if(!token){
        navigate('/authentication?mode=login');
        return;
	  }
      socket.on('connect',()=>{});
    }
	console.log("connecting to the server .......");
	connectToChatSession();

    
  },[]);


  useEffect(()=>{
	function recieveMessage(){
		socket.on('recieveMessage',(messages)=>{
			console.log(messages);
			setMessages((previousSate)=>{
				return [...previousSate,...messages];
			})
		})
	}

	recieveMessage();
  },[])

  useEffect(()=>{
	function getRooms(){
		socket.emit('getRoomsByUserName',(rooms,error)=>{
			if(error){
				alert("cannot fetch previous chats");
				return;
			}
			if(rooms){
				setChatHistory(rooms);
			}
			
		})
	}

	getRooms();
  },[])

  function handleSubmit(event){
	event.preventDefault();
	const message = inputRef.current.value;
	if(message&&currentRoomId){
		console.log("sending the message ",message);
		socket.emit('sendMessage',message,currentRoomId,(responseData,error)=>{
			console.log(responseData);
			console.log(error);
		});
		inputRef.current.value = "";
	}
  }

  function joinRoom(roomId){
	if(roomId){
		socket.emit('joinRoom',roomId,(joinedRoom,error)=>{
			if(error){
				alert("cannot fetch chats");
				return;
			}
			if(joinedRoom){
				getMessagesOfRoom();
				setChatHistory((previousSate)=>{
					return [...previousSate,joinedRoom];
				})
			}
		});
	}
  }

  function getMessagesOfRoom(roomId){
	socket.emit("getMessagesofRoom",roomId,(messages,error)=>{
		if(error){
			alert("cannot get messages of room ");
			return;
		}
		setMessages(messages);
	})
  }

  function createChatRoom(){
	const roomName = chatNameRef.current.value;
	socket.emit('createRoom',roomName,(response,_err)=>{
		if(response){
			setChatHistory((previousState)=>{
				return [...previousState,response];
			});
		}
		else{
			console.warn("room cannot be created");
		}
	});
	chatNameRef.current.value = "";
  }

  return (
    <section className="h-screen w-screen flex flex-[0.8] p-5 " >

		<div className="chat_history h-full flex-[0.2] p-5 bg-black rounded-3xl ">
			<input ref={chatNameRef} type="text" placeholder="Enter chatname" className="w-full h-9 mb-5 rounded-lg pl-5" />
			<button onClick={createChatRoom} className="bg-white text-black w-full h-8 rounded-xl" >New chat</button>
			<span className="block h-10" ></span>
			<input ref={roomNameRef} type="text" placeholder="Enter chatname" className="w-full h-9 mb-5 rounded-lg pl-5" />
			<button onClick={()=>{
				const roomId = roomNameRef.current.value;
				if(roomId){
					joinRoom(roomId);
					roomNameRef.current.value = "";
				}
					
				else alert("enter a roomid");
			}} className="bg-white text-black w-full h-8 rounded-xl" >Join chat</button>
			<div className="chats mt-10 flex flex-col gap-4 ">
			{
				chatHistory.map((room,index)=>{
					return <button key={index} onClick={()=>{		
						setCurrentRoomId(room.roomId);
						getMessagesOfRoom(room.roomId);
					}} className="w-full pt-2 pb-2 rounded-md capitalize  bg-white" >{room.roomName}</button>
				})
			}
			</div>
		</div>

		<div className="chat_window flex-[0.8] pl-5 pr-5">
			<div className="chat_messages h-[90%] ">
			{
				messages.map((chat,index)=>{
					return <div key={index}  >
						<h1 style={{
							textAlign:chat.userName === 'chatbot'? 'right':'left'		
						}} > {chat.message} </h1>	
					</div>
				})
			}
			</div>
			<form className="w-full flex justify-between " onSubmit={handleSubmit}>
				<input className="h-10 flex-[0.8]  border border-black pl-5" ref={inputRef} type="text" placeholder="enter the message" />
				<button className=" flex-[0.15] bg-black pl-5 pr-5 pt-3 pb-3 text-white rounded-lg " type="submit" >Send</button>
			</form>
		</div>
		
        
    </section>
  )
}

export default ChatPage;