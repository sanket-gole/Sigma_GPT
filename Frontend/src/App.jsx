
import './App.css'
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'

import { useState } from 'react'

import MyContext from './MyContext.jsx'

import { v4 as uuid } from 'uuid';


function App() {
 const [promt,setPromt]=useState("");
 const [reply,setReply]=useState(null);
  const [currThreadId,setCurrThreadId]=useState(uuid);
  const [prevChats,setPrevChats]=useState([]);
  const[newChat,setNewChat]=useState(true)

  const[allThreads,setAllThreads]=useState([]); // to store all threads


 const  providerValues ={
  promt,
  setPromt,
  reply,
  setReply,
  currThreadId,
  setCurrThreadId,
  prevChats,
  setPrevChats,
  newChat,
  setNewChat,
  allThreads,
  setAllThreads,
 };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
     <Sidebar></Sidebar>
     <ChatWindow></ChatWindow>
     </MyContext.Provider>
    </div>
  )
}

export default App
