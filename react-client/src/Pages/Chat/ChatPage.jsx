import { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const chatNameRef = useRef(null);
  const roomNameRef = useRef(null);
  const token = localStorage.getItem('token');
  const [socket] = useState(() => io('http://localhost:8080/chat', { auth: { token: token ? token : null } }));
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState(null);

  useEffect(() => {
    function connectToChatSession() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/authentication?mode=login');
        return;
      }
      socket.on('connect', () => { });
    }
    connectToChatSession();
  }, []);

  useEffect(() => {
    function recieveMessage() {
      socket.on('recieveMessage', (messages) => {
        setMessages((previousState) => {
          return [...previousState, ...messages];
        });
      });
    }
    recieveMessage();
  }, []);

  useEffect(() => {
    function getRooms() {
      socket.emit('getRoomsByUserName', (rooms, error) => {
        if (error) {
          alert("Cannot fetch previous chats");
          return;
        }
        if (rooms) {
          setChatHistory(rooms);
        }
      });
    }
    getRooms();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const message = inputRef.current.value;
    if (message && currentRoomId) {
      socket.emit('sendMessage', message, currentRoomId, (responseData, error) => {
        console.log(responseData);
        console.log(error);
      });
      inputRef.current.value = "";
    }
  }

  function joinRoom(roomId) {
    if (roomId) {
      socket.emit('joinRoom', roomId, (joinedRoom, error) => {
        if (error) {
          alert("Cannot fetch chats");
          return;
        }
        if (joinedRoom) {
          getMessagesOfRoom();
          setChatHistory((previousState) => {
            return [...previousState, joinedRoom];
          });
        }
      });
    }
  }

  function getMessagesOfRoom(roomId) {
    socket.emit("getMessagesofRoom", roomId, (messages, error) => {
      if (error) {
        alert("Cannot get messages of room");
        return;
      }
      setMessages(messages);
    });
  }

  function createChatRoom() {
    const roomName = chatNameRef.current.value;
    socket.emit('createRoom', roomName, (response, _err) => {
      if (response) {
        setChatHistory((previousState) => {
          return [...previousState, response];
        });
      } else {
        console.warn("Room cannot be created");
      }
      chatNameRef.current.value = "";
    })
  }

  return (
    <section className="h-screen w-screen flex p-5">
      <div className="chat_history h-full w-1/4 p-5 bg-purple-500 rounded-lg">
        <div className="lavender-bg p-4 rounded-lg">
          <input ref={chatNameRef} type="text" placeholder="Enter chat name" className="w-full h-9 mb-5 rounded-lg pl-3 bg-gray-200 text-black" />
          <button onClick={createChatRoom} className="bg-purple-700 text-white w-full h-8 rounded-xl hover:bg-purple-800 transition-colors duration-300 ease-in-out">
            New chat
          </button>
          <div className="border-t border-b border-purple-600 my-5"></div>
          <input ref={roomNameRef} type="text" placeholder="Enter room ID" className="w-full h-9 mb-5 rounded-lg pl-3 bg-gray-200 text-black" />
          <button onClick={() => {
            const roomId = roomNameRef.current.value;
            if (roomId) {
              joinRoom(roomId);
              roomNameRef.current.value = "";
            } else {
              alert("Enter a room ID");
            }
          }} className="bg-purple-700 text-white w-full h-8 rounded-xl hover-bg-purple-800 transition-colors duration-300 ease-in-out">
            Join chat
          </button>
        </div>
        <div className="chats mt-10 flex flex-col gap-4">
          {chatHistory.map((room, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentRoomId(room.roomId);
                getMessagesOfRoom(room.roomId);
              }}
              className="w-full pt-2 pb-2 rounded-md bg-gray-200 hover-bg-gray-300 text-black hover-text-black transition-colors duration-300 ease-in-out">
              {room.roomName}
            </button>
          ))}
        </div>
      </div>
      <div className="chat_window w-3/4 pl-5 pr-5 bg-gray-300 rounded-lg">
        <div className="chat_messages h-5/6 overflow-y-auto">
          {messages.map((chat, index) => (
            <div key={index} className={`mb-2 ${chat.userName === 'chatbot' ? 'text-left' : 'text-right'}`}>
              <div className={`rounded p-3 ${chat.userName === 'chatbot' ? 'bg-purple-100 text-purple-900' : 'bg-purple-300 text-purple-900'} border border-purple-300 inline-block`}>
                {chat.message}
              </div>
            </div>
          ))}
        </div>
        <form className="w-full flex justify-between" onSubmit={handleSubmit}>
          <input className="h-10 w-3/4 border border-purple-300 rounded-l pl-3" ref={inputRef} type="text" placeholder="Enter the message" />
          <button className="w-1/4 bg-purple-700 text-white rounded-r p-3 hover-bg-purple-800 transition-colors duration-300 ease-in-out">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}

export default ChatPage;