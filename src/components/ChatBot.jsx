import React, { useState, useEffect, useRef } from "react";
import "./css/chatbot.css";
import botIcon from "./css/chatbot.png";

export default function ChatBotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        const hoTen = localStorage.getItem("ho_ten");
        const ten = hoTen ? hoTen.split(" ").slice(-1)[0] : "bạn";

        setMessages([
            { sender: "bot", text: `Xin chào ${ten} 👋\nTôi có thể giúp gì cho bạn?` }
        ]);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages(prev => [
            ...prev,
            { sender: "user", text: input },
            { sender: "bot", text: "🤖 Tôi đã nhận được câu hỏi của bạn!" }
        ]);

        setInput("");
    };

    return (
        <>
            {open && (
                <div className="chatbot-box">
                    <div className="chatbot-header">
                        🤖 CHATBOT
                        <button onClick={() => setOpen(false)}>✕</button>
                    </div>

                    <div className="chatbot-body">
                        {messages.map((m, i) => (
                            <div key={i} className={`chat-message ${m.sender}`}>
                                {m.text}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi..."
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage}>Gửi</button>
                    </div>
                </div>
            )}

            <div className="chatbot-fab" onClick={() => setOpen(!open)}>
                <img src={botIcon} alt="chatbot" />
            </div>
        </>
    );
}
