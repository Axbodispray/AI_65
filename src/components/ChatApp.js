import React, { useState } from "react";

import axios from "axios";
import "./ChatApp.css";

console.log("API Key:", process.env.REACT_APP_GEMINI_API_KEY); // Debug log

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Load API key from .env

function ChatApp() {
    console.log("Environment variables:", process.env); // Debug all env vars
    console.log("Gemini API Key status:", API_KEY ? "Present" : "Missing");
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        console.log("✅ Send button clicked"); // Debugging log

        if (!API_KEY) {
            console.error("❌ Missing Gemini API key!");
            setMessages([...messages, { text: "❌ API Key Missing!", sender: "bot" }]);
            return;
        }

        if (input.trim() === "") return;

        console.log("User input:", input); // Debugging log

        const userMessage = { text: input, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Log the request payload
            const requestPayload = {
                contents: [
                    {
                        parts: [
                            {
                                text: input
                            }
                        ]
                    }
                ]
            };
            console.log("📤 Request payload:", JSON.stringify(requestPayload, null, 2));

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                requestPayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ API Response:", response.data);
            
            const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't understand that.";
            const botMessage = { text: botReply, sender: "bot" };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("❌ Error Status:", error.response?.status);
            console.error("❌ Error Status Text:", error.response?.statusText);
            console.error("❌ Error Details:", {
                message: error.message,
                response: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers,
                    data: error.config?.data
                }
            });
            
            const errorMessage = error.response?.data?.error?.message || 
                                error.message || 
                                "Failed to get response";
            setMessages((prevMessages) => [...prevMessages, { 
                text: `Error: ${errorMessage}`, 
                sender: "bot" 
            }]);
        }

        setLoading(false);
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                    {loading && <div className="message bot">Typing...</div>}
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button type="button" onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatApp;
