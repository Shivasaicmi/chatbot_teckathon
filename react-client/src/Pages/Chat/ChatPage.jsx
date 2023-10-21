import { useEffect } from "react";

function ChatPage() {
  useEffect(()=>{
    console.log("I am in chatpage")
  },[])
  return (
    <div>
        <h1>this is chat page</h1>
    </div>
  )
}

export default ChatPage;