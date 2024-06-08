import React from 'react'
import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import "./Login.css"

const Login = ({socket}) => {

    const [name , setName] = useState("")
    const [room , setRoom] = useState("")
    const navigate = useNavigate()

    let handleSubmit = (e) =>{
        e.preventDefault()
        socket.emit("joinRoom", {name , room})
        navigate("/chat", { state: { room, name } })
    }

    return (
        <div className='login'>
            <h1>Chat.io</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Enter Name</label> 
                    <input type="text" placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div>
                    <label>Enter Room No</label> 
                    <input type="number" placeholder="Enter room number" onChange={(e)=>setRoom(e.target.value)}/>
                </div>
                <button type="submit">Enter Room</button>
            </form>
        </div>
    )
}

export default Login
