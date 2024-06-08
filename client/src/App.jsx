import './App.css'
import {Route , Routes} from "react-router-dom"
import Login from "./Page/Login"
import ChatUi from "./Page/chatUi"
import { io } from "socket.io-client"
import { useEffect, useState } from "react"

function App() {
  const socket = io("http://localhost:3000")

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
