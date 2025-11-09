import React, { useMemo, useState } from "react";

const ChatLayout = ({
  role = "patient",
  userName = "",
  doctors = [],
  patients = [],
  conversations = [],
  currentChat = [],
  liveMessages = [],
  loading = false,
  onSelectChat = () => {},
  onSendMessage = () => {},
  onOpenDoctorDirectory = () => {},
  onOpenAiChat = () => {},
}) => {
  const [activeTab, setActiveTab] = useState(role === "doctor" ? "patients" : "doctors");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [messageText, setMessageText] = useState("");

  const list = useMemo(
    () => (activeTab === "patients" ? patients : doctors),
    [activeTab, patients, doctors]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    return list.filter((l) =>
      (l.full_name || l.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [list, search]);

  const handleSelect = (item) => {
    setSelected(item);
    onSelectChat(item);
  };

  const handleSend = () => {
    if (!selected || !messageText.trim()) return;
    onSendMessage(messageText.trim(), selected.other_participant_id || selected.id);
    setMessageText("");
  };

  return (
    <div className="flex h-full bg-white">
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex bg-gray-100 mx-4 rounded-lg p-1">
          {role === "doctor" && (
            <button
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
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
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
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
                selected?.id === item.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0">
                <span className="text-gray-600 font-medium text-sm">
                  {(item.full_name || item.name || "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {item.full_name || item.name}
                  </p>
                  {item.unread_count > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                      {item.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {item.last_message || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        {selected ? (
          <>
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {(selected.full_name || selected.name || "?").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {selected.full_name || selected.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {activeTab === "patients" ? "Patient" : "Doctor"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {currentChat && currentChat.length > 0 ? (
                currentChat.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex ${
                      message.sender_id !== selected.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                        message.sender_id !== selected.id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p>{message.content || message.text}</p>
                      {message.timestamp && (
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Message"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Hello Doctor</h3>
            <p className="text-gray-500 text-center px-8">
              I am having some issues with prescription
            </p>
            <p className="text-xs text-gray-400 mt-2">15 min ago</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
