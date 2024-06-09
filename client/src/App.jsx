import './App.css'
import {Route , Routes} from "react-router-dom"
import Login from "./Page/Login"
import ChatUi from "./Page/chatUi"
import { io } from "socket.io-client"
import { useEffect, useState } from "react"

function App() {
  
  const [socketState, setSocketState] = useState(null)
  
  useEffect(() => {
    const socket = io("https://socket-io-e3s4.onrender.com")
    // const socket = io("http://localhost:3000")
    
    setSocketState(socket)

    socket.on("connect", () => {
      console.log("Connected to server")
    })

    return () => {
      socket.disconnect()
    }
  },[])
  
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Login socket={socketState}/>} />
        <Route path="/chat" element={<ChatUi socket={socketState}/>} />
      </Routes>
    </>
  )
}

export default App
