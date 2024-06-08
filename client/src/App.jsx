import './App.css'
import {Route , Routes} from "react-router-dom"
import Login from "./Page/Login"
import ChatUi from "./Page/chatUi"
import { io } from "socket.io-client"
import { useEffect, useState } from "react"

function App() {
  const socket = io("https://socket-io-e3s4.onrender.com")

  useEffect(() => {
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
        <Route path="/" element={<Login socket={socket}/>} />
        <Route path="/chat" element={<ChatUi socket={socket}/>} />
      </Routes>
    </>
  )
}

export default App
