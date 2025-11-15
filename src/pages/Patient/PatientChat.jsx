import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";
import DashboardLayout from "../../components/Layout/DashboardLayout";

import {
  connectSocketAction,
  disconnectSocketAction,
} from "../../redux/features/socketSlice";
import { FileText } from "lucide-react";
import {
  fetchPatientChats,
  fetchChatRoomDetails,
  clearCurrentChat,
} from "../../redux/features/chatSlice";

import { sendSocketMessage } from "../../utils/socket";

import homeIcon from "../../assets/dashboard.svg";
import appointmentIcon from "../../assets/appointment.svg";
import chatsIcon from "../../assets/chat.svg";
import profileIcon from "../../assets/profile.svg";
import blogIcon from "../../assets/blog.svg";

const PatientChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { patientChats, currentMessages, loading } = useSelector((state) => state.chat);

  const [showAiChat, setShowAiChat] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  useEffect(() => {
    console.log("🔄 PatientChat mounted, loading chats...");
    if (user?.id) {
      dispatch(fetchPatientChats());
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    return () => {
      console.log("🧹 PatientChat unmounting, cleaning up...");
      dispatch(disconnectSocketAction());
      dispatch(clearCurrentChat());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log(" Patient chats updated:", patientChats);
  }, [patientChats]);
useEffect(() => {
  const handleAppointmentCompleted = (event) => {
    console.log("⏰ Appointment completed event received:", event.detail);
    
    if (selectedChatRoom) {
      alert("This appointment has ended. The chat is now closed.");
      dispatch(disconnectSocketAction());
      dispatch(clearCurrentChat());
      setSelectedChatRoom(null);

      setTimeout(() => {
        dispatch(fetchPatientChats());
      }, 1000);
    }
  };
  
  window.addEventListener('appointmentCompleted', handleAppointmentCompleted);
  
  return () => {
    window.removeEventListener('appointmentCompleted', handleAppointmentCompleted);
  };
}, [selectedChatRoom, dispatch]);

  const handleSelectChat = async (chatRoom) => {
    console.log("📱 Selecting chat:", chatRoom);
    setShowAiChat(false);
    
    // ✅ First disconnect any existing socket
    dispatch(disconnectSocketAction());
    dispatch(clearCurrentChat());

    try {
      console.log("🔍 Fetching room details for room:", chatRoom.id);
      const result = await dispatch(fetchChatRoomDetails(chatRoom.id)).unwrap();
      console.log("✅ Room details loaded:", result);
      
      if (result && result.id) {
        // ✅ Set selected chat ONLY after successful fetch
        setSelectedChatRoom(chatRoom);
        
        console.log("🔌 Connecting WebSocket to room:", result.id);
        dispatch(connectSocketAction(chatRoom.id));
      }
    } catch (error) {
      console.error("❌ Failed to load chat room:", error);
      
      // ✅ Clear selection on error
      setSelectedChatRoom(null);
      
      // ✅ Show user-friendly error
      if (error?.roomDeleted || error?.status === 404) {
        alert("⚠ This chat is no longer available. The appointment may have been cancelled or deleted. Refreshing your chat list...");
      } else if (error?.status === 403) {
        alert("⚠ You don't have access to this chat anymore.");
      } else {
        alert("⚠ Unable to load this chat. Please try again or refresh the page.");
      }
      
      // ✅ Refresh the chat list to remove deleted chats
      dispatch(fetchPatientChats());
    }
  };

  const handleSendMessage = (text, roomId) => {
    if (!text.trim() || !roomId) return;
    console.log("📤 Sending message to room:", roomId, text);
    sendSocketMessage(text);
  };

  const sidebarItems = [
    { label: "Dashboard", to: "/patient/dashboard", icon: homeIcon },
    { label: "Appointments", to: "/patient/appointments", icon: appointmentIcon },
    { label: "Chats", to: "/patient/chats", icon: chatsIcon },
    { label: 'Prescriptions', to: '/patient/prescriptions', icon: <FileText className="w-5 h-5" /> },
    { label: "Blogs", to: "/patient/blogs", icon: blogIcon },
    { label: "Profile", to: "/patient/profile", icon: profileIcon },
  ];

  if (loading && patientChats.length === 0) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} role="patient">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your chats...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!loading && patientChats.length === 0) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} role="patient">
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">💬</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Chats Available</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">How to start chatting:</h3>
              <ol className="text-blue-800 space-y-2 text-sm">
                <li>1️⃣ Book an appointment with a doctor</li>
                <li>2️⃣ Wait for the doctor to accept your request</li>
                <li>3️⃣ Once accepted, the chat will appear here!</li>
              </ol>
            </div>
            <button
              onClick={() => window.location.href = '/patient/appointments'}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
            >
              📅 Book Appointment Now
            </button>
            <button
              onClick={() => dispatch(fetchPatientChats())}
              className="ml-4 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="patient">
      <ChatLayout
        role="patient"
        userName={`${user?.first_name || ""} ${user?.last_name || ""}`}
        doctors={patientChats}
        patients={[]}
        currentMessages={currentMessages}
        onSelectChat={handleSelectChat}
        onSendMessage={handleSendMessage}
        showAiChat={showAiChat}
        onCloseAiChat={() => setShowAiChat(false)}
        onOpenAiChat={() => {
          setShowAiChat(true);
          setSelectedChatRoom(null);
          dispatch(disconnectSocketAction());
          dispatch(clearCurrentChat());
        }}
      />
    </DashboardLayout>
  );
};

export default PatientChat;