import React from 'react'
import { useEffect, useState , useRef} from "react"
import { useLocation } from 'react-router-dom'
import "./ChatUI.css"
import { io } from "socket.io-client"


const chatUi = ({socket}) => {

    let mes = [
        {txt:"Hello" , sender:"user1"},
        {txt:"Hi" , sender:"user2"},
        {txt:"How are you?" , sender:"user1"},
        {txt:"I am fine" , sender:"user2"},
        {txt:"What about you?" , sender:"user2"},
        {txt:"I am also fine" , sender:"user1"},
        {txt:"User Joined the room" , sender:"server"},
        {txt:"Good to hear that" , sender:"user2"},
        {txt:"Bye" , sender:"user1"},
        {txt:"Bye" , sender:"user2"},
    ]

    const [message , setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const location = useLocation()
    const messagesEndRef = useRef(null);
    const [roomCount, setRoomCount] = useState(0);
    const { room, name } = location.state || {}

    // const socket = io("http://localhost:3000")

    useEffect(() => {
      // socket.on("connect", () => {
      //   console.log("Connected to server")
      // })

      socket.on("user-msg", (msg) => {
          setMessages((messages)=>[...messages, {txt:msg.msg , sender:"user2", name:msg.name}])
      })

      socket.on("Servermessage", (msg) => {
          setMessages((messages)=>[...messages, {txt:msg , sender:"server" , name:""}])
      })

      socket.on('roomCount', handleRoomCount);

      return () => {
        socket.off("user-msg");
        socket.off("Servermessage");
        socket.off("roomCount");
        socket.emit("leaveRoom", { name, room });
      }
    }, [])

    const handleRoomCount = (count) => {
        setRoomCount(count);
      };

    let handleSubmit = (e) =>{
        e.preventDefault()
        socket.emit("message", message)
        setMessages((messages)=>[...messages, {txt:message , sender:"user1" , name:name}])
        setMessage("")
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

  return (
    <div>
      <h1>Room {room}</h1>
      <h2>Online Members: {roomCount}</h2>
      <div className='chatmessage-cont'>
        <div className='mess-cont'>
            <ul>
                {messages.map((msg , index) => {
                  return <li key={index} className={msg.sender == 'server' ? 'server-msg' : msg.sender == "user1" ? 'sender' : 'receiver'}>
                  <div className="sender-name">{msg.name}</div>
                  <div className="message-box">{msg.txt}</div>
                </li>
                })}
            <div ref={messagesEndRef} />
            </ul>
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder='Enter Message'/>
            <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default chatUi
