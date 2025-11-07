import React, { useState } from "react";
import { Search, Edit2, MessageSquare, X } from "lucide-react";

const ChatLayout = ({ role, userName }) => {
  const [activeTab, setActiveTab] = useState(role === "doctor" ? "patients" : "doctors");
  const [selectedChat, setSelectedChat] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fake Chat Data
  const patients = [
    { id: 1, name: "Naina", lastMessage: "Hi", unread: true },
    { id: 2, name: "Arohi", lastMessage: "I’m having some issues with prescription", unread: false },
    { id: 3, name: "Riya", lastMessage: "Hello Doctor!", unread: false },
  ];

  const doctors = [
    { id: 4, name: "Dr. Aarav", specialization: "Cardiologist", lastMessage: "Hi!", unread: true },
    { id: 5, name: "Dr. Meera", specialization: "Neurologist", lastMessage: "See you at 4 PM", unread: false },
    { id: 6, name: "Dr. Karan", specialization: "Dermatologist", lastMessage: "Thanks!", unread: false },
  ];

  const selectedTabData = activeTab === "patients" ? patients : doctors;

  // Dummy Messages
  const messages = [
    { id: 1, sender: "me", text: "Hello! How are you feeling today?" },
    { id: 2, sender: "them", text: "Hi Doctor, feeling better but still have a cough." },
    { id: 3, sender: "me", text: "Alright, continue the medicine for two more days." },
  ];

  return (
    <div className="flex h-[90vh] bg-white shadow-md rounded-2xl overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[28%] border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold text-lg text-gray-800">Dr. {userName}</h2>
          <Edit2 size={18} className="text-gray-500 cursor-pointer" />
        </div>

        {/* Search Bar */}
        <div className="relative p-3">
          <Search className="absolute left-6 top-6 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-3 py-2 w-full text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2A87D7] bg-gray-50 text-gray-700"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-around border-b">
          {role === "doctor" && (
            <button
              className={`w-1/2 py-2 font-medium text-sm ${
                activeTab === "patients"
                  ? "border-b-2 border-[#2A87D7] text-[#2A87D7]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("patients")}
            >
              Patients
            </button>
          )}
          <button
            className={`w-1/2 py-2 font-medium text-sm ${
              activeTab === "doctors"
                ? "border-b-2 border-[#2A87D7] text-[#2A87D7]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("doctors")}
          >
            Doctors
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2">
          {selectedTabData.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedChat(item)}
              className={`p-3 rounded-lg flex justify-between items-center cursor-pointer mb-1 ${
                selectedChat?.id === item.id
                  ? "bg-blue-50 border-l-4 border-[#2A87D7]"
                  : "hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                <p className="text-xs text-gray-500 truncate w-[150px]">
                  {item.lastMessage}
                </p>
              </div>
              {item.unread && (
                <span className="w-2 h-2 bg-[#2A87D7] rounded-full"></span>
              )}
            </div>
          ))}
        </div>

        {/* Chat with Doctor Button */}
        {role === "doctor" && (
          <div className="p-3 border-t">
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex justify-center items-center gap-2 text-white bg-[#2A87D7] hover:bg-blue-600 py-2 rounded-md text-sm font-medium"
            >
              <MessageSquare size={16} /> Chat with a Doctor
            </button>
          </div>
        )}
      </div>

      {/* Right Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4 font-medium text-gray-800 flex justify-between items-center">
              {selectedChat.name}
              {selectedChat.specialization && (
                <span className="text-sm text-gray-500">
                  {selectedChat.specialization}
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-xs ${
                      msg.sender === "me"
                        ? "bg-[#2A87D7] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

<div className="border-t p-3 flex items-center gap-2">
  <input
    type="text"
    value={messageText}
    onChange={(e) => setMessageText(e.target.value)}
    placeholder="Type a message..."
    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#2A87D7]"
  />
  <button
    onClick={() => {
      if (selectedChat && messageText.trim()) {
        onSendMessage?.(messageText, selectedChat.id);
        setMessageText("");
      }
    }}
    className="px-4 py-2 bg-[#2A87D7] text-white rounded-md text-sm hover:bg-blue-600"
  >
    Send
  </button>
</div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare size={48} className="text-[#2A87D7] mb-2" />
            <p>Your messages will be displayed here</p>
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-[400px] shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Select a Doctor
            </h3>
            <input
              type="text"
              placeholder="Search doctor..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#2A87D7]"
            />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 border border-gray-100 rounded-md hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.specialization}</p>
                  </div>
                  <button className="text-[#2A87D7] text-sm font-medium">
                    Request Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
