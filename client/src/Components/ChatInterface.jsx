import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';

const ChatInterface = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [online, setOnline] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        window.location.reload();
    };

    console.log(selectedUser);

    useEffect(() => {
        const socket = io("https://socket-io-e3s4.onrender.com", { query: { userId: localStorage.getItem("id") } });
        // const socket = io("http://localhost:3000" , {query:{userId:localStorage.getItem("id")}})
    
        socket.on("connect", () => {
            console.log("Connected to server");
            setOnline(true);
        });

        socket.on("new-message", (msg) => {
            setMessages((prevMess) => [...prevMess, msg]);
        });

        return () => {
            socket.disconnect();
            setOnline(false);
            localStorage.setItem("selectedUser", null);
        };
    }, []);

    useEffect(() => {
        try {
            axios.get(`http://localhost:3000/getConversations/${localStorage.getItem('id')}`)
                .then((res) => {
                    setUsers(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        localStorage.setItem("selectedUser", user);
        setLoading(true);
        axios.get(`http://localhost:3000/getMessages/${localStorage.getItem("id")}/${user}`)
            .then((res) => {
                setMessages(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEndChat = () => {
        setSelectedUser(null);
        setShowOptions(false);
    };

    const handleSendMessage = () => {
        if (message.trim() === '') return;
        axios.post(`http://localhost:3000/send/${selectedUser}`, { message, senderId: localStorage.getItem("id") })
            .then((res) => {
                setMessage('');
                console.log(res.data);
                setMessages([...messages, res.data]);
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-[80%] bg-gray-900 w-[85vw] md:w-[60vw]">
            {(!isMobile || !selectedUser) && (
                <div className="bg-gray-800 md:w-64 p-4 w-full">
                    <h2 className="text-white font-bold mb-4">Chat.io</h2>
                    <button className='bg-gray-500 text-black p-2 rounded hover:bg-gray-300' onClick={handleLogout}>Logout</button>
                    <hr className='my-6' />
                    <ul>
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className={`flex items-center justify-between mb-4 cursor-pointer p-2 rounded-lg ${selectedUser === user._id ? "bg-gray-500" : ""
                                    }`}
                                onClick={() => handleUserClick(user._id)}
                            >
                                <div className="relative">
                                    <img
                                        className="w-10 h-10 rounded-full"
                                        src={user.profile}
                                        alt=""
                                    />
                                </div>
                                <div className="flex-1 px-5">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">{user.username}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            )}

            {(!isMobile || selectedUser) && (
                <div className='md:w-[50vw] w-full'>
                    {selectedUser == null ? (
                        <div className="flex items-center justify-center h-[80vh] bg-gray-900">
                            <h2 className="text-white">Select a user to start chatting</h2>
                        </div>
                    ) : (
                        <div className="flex flex-col h-[80vh] bg-gray-900">
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                                <div className="flex items-center justify-between md:px-4 py-2 bg-gray-800">
                                    <div className="flex items-center justify-between">
                                        {isMobile && (
                                            <button
                                                className="text-gray-400 hover:text-white focus:outline-none mr-4"
                                                onClick={() => setSelectedUser(null)}
                                            >
                                                <svg width="24px" height="24px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="#ffffff" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></g></svg>
                                            </button>
                                        )}
                                        <img
                                            src="https://avatar.iran.liara.run/public/9"
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full mr-2"
                                        />
                                        <span className="text-white font-semibold">
                                            {selectedUser ? users.find((user) => user._id === selectedUser).username : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        className="text-gray-400 hover:text-white focus:outline-none"
                                        onClick={() => setShowOptions(!showOptions)}
                                    >
                                        <i className="fas fa-ellipsis-v">options</i>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4">
                                <div className="flex flex-col">
                                    {loading ? <p>Getting Messages</p> : messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`mb-2 rounded-lg ${msg.receiverId === selectedUser ? 'self-end bg-indigo-600' : 'self-start bg-gray-700'
                                                } text-white px-4 py-2 max-w-xs`}
                                        >
                                            <p>{msg.message}</p>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                            <div className="flex items-center bg-gray-800 px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-grow bg-gray-700 text-white rounded-full px-4 py-2 mr-2"
                                    value={message}
                                    onKeyPress={handleKeyPress}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button className="bg-indigo-600 text-white rounded-full md:px-4 px-2 py-2" onClick={handleSendMessage}>
                                    <i className="fas fa-paper-plane"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
