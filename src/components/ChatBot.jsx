import React, { useState, useEffect, useRef } from "react";
import "./css/chatbot.css";
import botIcon from "./css/chatbot.png";

/* ================= CHAT API ================= */
async function sendChatToAPI(message) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token");

    const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("Chat API failed");
    return res.json(); // { reply }
}

/* ================= INBOX API ================= */
async function fetchUnreadCount() {
    const token = localStorage.getItem("access_token");
    if (!token) return 0;

    const res = await fetch("http://127.0.0.1:8000/email/inbox", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) return 0;

    const data = await res.json();
    const emails = data.emails || [];
    return emails.filter((m) => m.is_read === 0).length;
}

export default function ChatBotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [hoTen, setHoTen] = useState("");
    const bottomRef = useRef(null);

    /* ================= LẤY TÊN ================= */
    useEffect(() => {
        const updateName = () => {
            setHoTen(localStorage.getItem("ho_ten") || "");
        };

        updateName();
        window.addEventListener("storage", updateName);
        return () => window.removeEventListener("storage", updateName);
    }, []);

    /* ================= LỜI CHÀO ================= */
    useEffect(() => {
        const ten = hoTen
            ? hoTen.split(" ").slice(-1)[0]
            : "bạn";

        setMessages([
            {
                sender: "bot",
                text: `Xin chào ${ten} 👋\nTôi có thể giúp gì cho bạn?`,
            },
        ]);
    }, [hoTen]);

    /* ================= CHECK EMAIL KHI MỞ CHATBOT ================= */
    useEffect(() => {
        if (!open) return;

        const checkInbox = async () => {
            const unread = await fetchUnreadCount();

            if (unread > 0) {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "bot",
                        text: `🔔 Bạn có ${unread} email chưa đọc`,
                    },
                ]);
            }
        };

        checkInbox();
    }, [open]);

    /* ================= AUTO SCROLL ================= */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ================= SEND MESSAGE ================= */
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput("");

        setMessages((prev) => [
            ...prev,
            { sender: "user", text: userText },
            { sender: "bot", text: "🤖 Đang trả lời..." },
        ]);

        try {
            const res = await sendChatToAPI(userText);
            setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                    sender: "bot",
                    text: res.reply,
                };
                return copy;
            });
        } catch {
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
