import './App.css'
import { Route , Routes , Navigate} from "react-router-dom"
import LoginForm from './Components/loginform'
import RegisterForm from './Components/RegisterForm'
import ChatInterface from './Components/ChatInterface'

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/chatinterface" element={sessionStorage.getItem("loggedin") === "true" ? <ChatInterface /> : <Navigate to={"/"}/>} />
      </Routes>
    </>
  )
}

export default App
