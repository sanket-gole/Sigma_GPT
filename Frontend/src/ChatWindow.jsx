import "./ChatWindow.css";
import Chat from "./Chat";

import { useContext, useState, useEffect, use } from "react";
// ChatWindow.jsx
import MyContext from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    promt,
    setPromt,
    reply,
    setReply,
    currThreadId,
    prevchats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    console.log("Prompt:", promt);
    console.log("Current Thread ID:", currThreadId);
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: promt,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch("https://sigma-gpt-backend.onrender.com/api/chat", option);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.error("Error fetching reply:", err);
    }
    setLoading(false);
  };

  // Append new chat to privieos chat
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevchats) => [
        ...prevchats,
        {
          role: "user",
          content: promt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPromt("");
  }, [reply]);


  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }
  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-chevron-down"></i>{" "}
        </span>
        <div className="userIconDiv"  onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i class="fa-solid fa-gear"></i>&nbsp;Settings
          </div>
          <div className="dropDownItem">
            <i class="fa-solid fa-cloud-arrow-up"></i>&nbsp;Upgrade plan
          </div>

          <div className="dropDownItem">
            <i class="fa-solid fa-right-from-bracket"></i>&nbsp;Log Out
          </div>
        </div>
      )}
      <Chat></Chat>
      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anything"
            value={promt}
            onChange={(e) => setPromt(e.target.value)}
            onKeyDown={(e) => (e.key == "Enter" ? getReply() : "")}
          />

          <div id="sumbit" onClick={getReply}>
            <i className="fa-solid  fa-paper-plane"></i>
          </div>
        </div>
        <p className="">
          SigmaGPT can make mistakes. Check important info. See Cooki Prefrence
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
