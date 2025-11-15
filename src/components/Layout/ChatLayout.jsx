import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Send, Search } from "lucide-react";
import { generateContent } from "../../api/gemini";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import msgIcon from "../../assets/msg.svg";
import sendBtn from "../../assets/sendbtn.svg";

const ChatLayout = ({
  role = "patient",
  userName = "",
  doctors = [],
  patients = [],
  currentMessages = [],
  onSelectChat = () => {},
  onSendMessage = () => {},
  showAiChat = false,
  onCloseAiChat = () => {},
  onOpenAiChat = () => {},
  onOpenConnectionManager = () => {},
}) => {
  const [activeTab, setActiveTab] = useState(
    role === "doctor" ? "patients" : "doctors"
  );
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showChatView, setShowChatView] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [aiMessages, setAiMessages] = useState([]);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, aiMessages]);

  useEffect(() => {
    if (showAiChat && inputRef.current && messageText === "") {
      inputRef.current.focus();
    }
  }, [showAiChat, aiMessages.length]);

  const list = useMemo(
    () => (activeTab === "patients" ? patients : doctors),
    [activeTab, patients, doctors]
  );


  const filtered = useMemo(() => {
    if (!search.trim()) return list;

    return list.filter((l) => {
      const name =
        l.other_participant?.full_name ||
        l.name ||
        l.participant_full_name ||
        "Unknown";

      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [list, search]);

  const handleSelect = async (item) => {
    setSelected(item);
    setShowChatView(true);
    try {
      await onSelectChat(item);
    } catch (error) {
      console.error("Failed to load chat:", error);
      alert("This chat room is no longer available. Please refresh the page.");
      setSelected(null);
      setShowChatView(false);
    }
  };

  const handleBack = () => {
    setShowChatView(false);
    setSelected(null);
  };
  const handleSend = useCallback(async () => {
    if (showAiChat) {
      if (!messageText.trim()) return;

      const query = messageText.trim();
      const userMessage = { sender: "user", text: query };
      const loadingMsg = { sender: "ai", text: "..." };
      
      setAiMessages((prev) => [...prev, userMessage, loadingMsg]);
      setMessageText("");
      
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });

      try {
        const aiResponse = await generateContent(query);
        setAiMessages((prev) => {
          const updated = [...prev];
          updated.pop(); 
          return [...updated, { sender: "ai", text: aiResponse }];
        });
      } catch (err) {
        setAiMessages((prev) => {
          const updated = [...prev];
          updated.pop(); 
          return [
            ...updated,
            {
              sender: "ai",
              text: "⚠ Sorry, I couldn't process that. Please try again.",
            },
          ];
        });
      }
    } else {
      if (!messageText.trim() || !selected) return;
      onSendMessage(messageText.trim(), selected.id);
      setMessageText("");
    }
  }, [showAiChat, messageText, selected, onSendMessage]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const ChatListView = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h3 className="text-xl font-bold mb-2">{userName || "User"}</h3>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-3 py-2 rounded-lg text-sm bg-white bg-opacity-20 text-white placeholder-gray-200 focus:bg-white focus:text-gray-800 focus:placeholder-gray-400 focus:outline-none transition-all"
          />
        </div>
      </div>

      {role === "doctor" && (
        <div className="flex bg-white border-b">
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "patients"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => {
              setActiveTab("patients");
              if (role === "doctor") {
                onFetchDoctorPatients?.();
              }
            }}
          >
            Patients {patients.length > 0 && `(${patients.length})`}
          </button>

          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "doctors"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("doctors")}
          >
            Doctors {doctors.length > 0 && `(${doctors.length})`}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const displayName =
              item.other_participant?.full_name ||
              item.name ||
              item.participant_full_name ||
              "Unknown";
            const lastMessage = item.last_message || "No messages yet";

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg mr-3 flex-shrink-0">
                  {displayName && typeof displayName === "string"
                    ? displayName.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {displayName}
                    </p>
                    {item.unread_count > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
                        {item.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <img
              src={msgIcon}
              alt="No chats"
              className="w-24 h-24 mb-4 opacity-50"
            />
            <p className="text-center">
              {search ? "No chats found" : "No chats yet"}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <button
          onClick={onOpenAiChat}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all duration-200 shadow-lg"
        >
          Chat with AI
        </button>
      </div>
    </div>
  );

  const ChatView = () => (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center shadow-lg">
        <button
          onClick={showAiChat ? onCloseAiChat : handleBack}
          className="mr-3 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center flex-1">
          {!showAiChat && (
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center font-bold text-lg mr-3">
              {(
                selected?.other_participant?.full_name ||
                selected?.other_participant ||
                selected?.name ||
                "U"
              )
                ?.charAt(0)
                ?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <h2 className="font-semibold text-lg">
              {showAiChat
                ? "🤖 MedBot AI Assistant"
                : selected?.other_participant?.full_name ||
                  selected?.other_participant ||
                  selected?.name ||
                  "Chat"}
            </h2>
            {!showAiChat && (
              <p className="text-xs text-blue-100">Tap to view info</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#E5DDD5]">
        {showAiChat ? (
          // AI Chat Messages
          aiMessages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center h-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                  Hello, {userName || "User"}!
                </h3>
                <p className="text-gray-600">How may I help you today?</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-md ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )
        ) : // Regular Chat Messages
        currentMessages.length > 0 ? (
          <div className="space-y-3">
            {currentMessages.map((msg) => {
              const isCurrentUser =
                msg.sender?.id === msg.sender_id || msg.sender_role === role;
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[80%]">
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-md ${
                        isCurrentUser
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 px-2 ${
                        isCurrentUser ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
              <img
                src={msgIcon}
                alt="No messages"
                className="w-16 h-16 mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">Start the conversation!</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white p-3 border-t shadow-lg">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Mobile View: Toggle between list and chat */}
      <div className="md:hidden h-full">
        {showChatView || showAiChat ? <ChatView /> : <ChatListView />}
      </div>

      {/* Desktop View: Side-by-side */}
      <div className="hidden md:flex h-full">
        {/* Left Panel - Chat List */}
        <div className="w-96 border-r h-full">
          <ChatListView />
        </div>

        {/* Right Panel - Chat View */}
        <div className="flex-1 h-full">
          {selected || showAiChat ? (
            <ChatView />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50">
              <img
                src={msgIcon}
                alt="Messages"
                className="w-32 h-32 mb-6 opacity-50"
              />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to MedTrax Chat
              </p>
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
