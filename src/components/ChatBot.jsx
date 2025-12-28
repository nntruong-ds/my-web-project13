import React, { useState, useEffect, useRef } from "react";
import "./css/chatbot.css";
import botIcon from "./css/chatbot.png";

/**
 * Gọi API chat backend
 */
async function sendChatToAPI(message) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token found");
    }

    const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
    });

    if (!res.ok) {
        throw new Error("Chat API failed");
    }

    return res.json(); // { reply: "..." }
}

export default function ChatBotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    // Lời chào ban đầu
    useEffect(() => {
        const hoTen = localStorage.getItem("ho_ten");
        const ten = hoTen ? hoTen.split(" ").slice(-1)[0] : "bạn";

        setMessages([
            {
                sender: "bot",
                text: `Xin chào ${ten} 👋\nTôi có thể giúp gì cho bạn?`,
            },
        ]);
    }, []);

    // Auto scroll xuống cuối
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Gửi message
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput("");

        // Hiển thị ngay message user + bot đang trả lời
        setMessages((prev) => [
            ...prev,
            { sender: "user", text: userText },
            { sender: "bot", text: "🤖 Đang trả lời..." },
        ]);

        try {
            const res = await sendChatToAPI(userText);

            // Thay message bot cuối cùng bằng reply thật
            setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                    sender: "bot",
                    text: res.reply,
                };
                return copy;
            });
        } catch (err) {
            setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                    sender: "bot",
                    text: "❌ Không thể kết nối chatbot",
                };
                return copy;
            });
        }
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
                            <div
                                key={i}
                                className={`chat-message ${m.sender}`}
                            >
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
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                        />
                        <button onClick={sendMessage}>Gửi</button>
                    </div>
                </div>
            )}

            {/* Floating button */}
            <div
                className="chatbot-fab"
                onClick={() => setOpen(!open)}
            >
                <img src={botIcon} alt="chatbot" />
            </div>
        </>
    );
}
