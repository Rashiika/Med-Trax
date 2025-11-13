import React, { useMemo, useState } from "react";
import { generateContent } from "../../api/gemini";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import msgIcon from "../../assets/msg.svg";
import sendBtn from "../../assets/sendbtn.svg";

const ChatLayout = ({
  role = "patient",
  userName = "",
  doctors = [],
  patients = [],
  currentChat = [],
  onSelectChat = () => {},
  onSendMessage = () => {},
  showAiChat = false, // ✅ new prop
  onCloseAiChat = () => {},
  onOpenAiChat = () => {}, // ✅ new prop to open AI chat
}) => {
  const [activeTab, setActiveTab] = useState(
    role === "doctor" ? "patients" : "doctors"
  );
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [aiMessages, setAiMessages] = useState([]); // ✅ store AI messages

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const list = useMemo(
    () => (activeTab === "patients" ? patients : doctors),
    [activeTab, patients, doctors]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    return list.filter((l) =>
      (l.full_name || l.name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [list, search]);

  const handleSelect = (item) => {
    setSelected(item);
    onSelectChat(item);
  };

  const handleSend = async () => {
    if (showAiChat) {
      if (!messageText.trim()) return;

      const userMessage = { sender: "user", text: messageText.trim() };
      setAiMessages((prev) => [...prev, userMessage]);

      const loadingMsg = { sender: "ai", text: "..." };
      setAiMessages((prev) => [...prev, loadingMsg]);

      const query = messageText.trim();
      setMessageText("");

      try {
        // 🔥 Call Gemini API
        const aiResponse = await generateContent(query);

        setAiMessages((prev) => {
          const updated = [...prev];
          updated.pop(); // remove "..." placeholder
          return [...updated, { sender: "ai", text: aiResponse }];
        });
      } catch (err) {
        console.error("AI Chat Error:", err);
        setAiMessages((prev) => {
          const updated = [...prev];
          updated.pop(); // remove "..." placeholder
          return [
            ...updated,
            {
              sender: "ai",
              text: "⚠️ Sorry, I couldn’t process that. Please try again.",
            },
          ];
        });
      }
    } else {
      // Handle normal chat
      if (!messageText.trim() || !selected) return;
      onSendMessage(messageText.trim(), selected);
      setMessageText("");
    }
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-98 border-r border-gray-200 flex flex-col bg-white h-full">
        {/* Doctor Name Header */}
        <div className="p-4 pb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {userName || "Doctor"}
          </h3>
        </div>
        
        <div className="px-4 pb-4">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex bg-gray-100 mx-4 rounded-lg p-1">
          {role === "doctor" && (
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md ${
                activeTab === "patients"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("patients")}
            >
              Patients
            </button>
          )}
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md ${
              activeTab === "doctors"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("doctors")}
          >
            Doctors
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`flex items-center p-3 cursor-pointer mb-2 rounded-lg transition-colors ${
                selected?.id === item.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-3">
                <span className="text-gray-600 font-medium text-sm">
                  {(item.full_name || item.name || "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {item.full_name || item.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {item.last_message || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat with AI Button at Bottom */}
        <div className="px-35 py-4">
          {!showAiChat ? (
            <button
              onClick={onOpenAiChat}
              className="w-40 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200"
            >
              🤖 Chat with AI
            </button>
          ) : (
            <button
              onClick={onCloseAiChat}
              className="w-40 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200"
            >
              ← Back to Chats
            </button>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
        {/* ✅ IF AI CHAT ENABLED */}
        {showAiChat ? (
          <>
            <div className="p-4 bg-white">
              <h2 className="font-semibold text-gray-800 text-lg">Medbot</h2>
            </div>

            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {aiMessages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                      Good evening, {userName || "Doctor"}
                    </h3>
                    <p className="text-gray-600 text-lg">How may I help you?</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {aiMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                          msg.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Message"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <img
                    src={sendBtn}
                    alt="Send"
                    className="w-6 h-6 opacity-750"
                  />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Normal doctor-patient chat (your existing code here)
          <>
            {selected ? (
              <>
                {/* Chat header and messages */}
                <div className="p-4 border-b bg-white">
                  <h2 className="font-semibold text-gray-800">
                    {selected.full_name || selected.name}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {currentChat.length > 0 ? (
                    currentChat.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          m.sender_id !== selected.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                            m.sender_id !== selected.id
                              ? "bg-blue-500 text-white"
                              : "bg-white border border-gray-200 text-gray-800"
                          }`}
                        >
                          {m.content || m.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 mt-6">
                      No messages yet.
                    </p>
                  )}
                </div>

                <div className="bg-white border-t p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!messageText.trim()}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                <div className="flex flex-col items-center justify-center">
                  <img 
                    src={msgIcon} 
                    alt="Messages" 
                    className="w-20 h-20 mb-4 opacity-100"
                  />
                  <p className="text-gray-600 text-lg">
                    Your messages will be displayed here
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
