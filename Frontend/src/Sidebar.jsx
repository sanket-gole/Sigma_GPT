import "./Sidebar.css";

import { useContext, useEffect } from "react";
import MyContext from "./MyContext";
import { v4 as uuid } from 'uuid';
function Sidebar(){

    const {allThreads, setAllThreads,currThreadId,setNewChat,setPromt,setReply,setCurrThreadId,setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
      try{ 
         const response=await fetch("https://sigma-gpt-backend.onrender.com/api/thread")
          const res=await response.json()

          const filteredData=res.map(thread=>({threadId:thread.threadId,title:thread.title}));
          console.log(filteredData)
          setAllThreads(filteredData);

      }catch(err){
        console.log(err);
      }
    };

    useEffect(()=>{
        getAllThreads();

    },[currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPromt("");
        setReply(null);
        setCurrThreadId(uuid());
        setPrevChats([]);
    }

    const changeThread= async(newThreadId)=>{
            setCurrThreadId(newThreadId);


            try{
                const response = await fetch(`https://sigma-gpt-backend.onrender.com/api/thread/${newThreadId}`)
                const res = await response.json();
                console.log(res)
                setPrevChats(res);
                setNewChat(false);
                setReply(null);
            }catch(err){
                console.error(err)
            }
    }

    const deleteThread = async(threadId) => {
        try{
        
           const response=await  fetch(`https://sigma-gpt-backend.onrender.com/api/thread/${threadId}`,{
                method: "DELETE",
            });
            const res = await response.json();
            console.log(res);

            setAllThreads(prevThreads =>
                prevThreads.filter(thread => thread.threadId !== threadId)
            );

            if(currThreadId === threadId) {
                createNewChat();
            }
        }catch(err){
            console.error(err);

        }
    }
    return(


        <section className="sidebar">
            {/* new chat button
             */}
           <button onClick={createNewChat} className="newChat">
               <img src="/assets/gpt1.png" alt="GPT Logo" className="logo" />
          <span> <i className="fa-solid fa-pen-to-square logo2"></i></span> 
          

           </button>

           {/* history section */}
           <ul className="history">
            {
                allThreads.map((thread, idx) => (
                   <li key={idx}
                   
                    onClick={(e)=>changeThread(thread.threadId)}
                    className={currThreadId === thread.threadId ? "highlighted" : ""}
                    >{thread.title}
                    <i className="fa-solid fa-trash"
                     onClick={(e)=>{
                        e.stopPropagation();
                        deleteThread(thread.threadId);
                     }}></i>
                    </li>
                ))
            }
           </ul>

           {/* sign  */}
           <div className="sign">
            <p>Keep Coding &hearts;</p>
           </div>
        </section>
    )
}


export default Sidebar;