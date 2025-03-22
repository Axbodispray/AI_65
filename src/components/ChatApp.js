import React, { useState } from "react";
import axios from "axios";
import "./ChatApp.css";

const API_KEY = "AIzaSyCYxkLlNXS3AQ5tLM1U2y8saiNGp85sY1A"; // Replace with your actual Gemini API key

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
                {
                    contents: [{ parts: [{ text: input }] }],
                },
                {
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Extract AI response
            const botMessage = { text: response.data.candidates[0].content.parts[0].text, sender: "bot" };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Gemini API Error:", error);
            setMessages((prevMessages) => [...prevMessages, { text: "Error getting response", sender: "bot" }]);
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
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatApp;
