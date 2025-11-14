import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  connectSocketAction,
  disconnectSocketAction,
} from "../../redux/features/socketSlice";
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

  // In PatientChat.jsx, update useEffect:

// In PatientChat.jsx, update useEffect:

useEffect(() => {
    if (user?.id) {
      console.log("🔄 Fetching patient's chat lists...");
      dispatch(fetchPatientChats()).then((result) => {
        console.log("✅ Patient's doctor chats:", result.payload);
      });
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    return () => {
      dispatch(disconnectSocketAction());
      dispatch(clearCurrentChat());
    };
  }, [dispatch]);

  const handleSelectChat = async (chatRoom) => {
    setShowAiChat(false);
    setSelectedChatRoom(chatRoom);

    // Disconnect from previous room
    dispatch(disconnectSocketAction());

    // Fetch chat room details (includes messages)
    await dispatch(fetchChatRoomDetails(chatRoom.id));

    // Connect to WebSocket for this room
    dispatch(connectSocketAction(chatRoom.id));
  };

  const handleSendMessage = (text, roomId) => {
    if (!text.trim() || !roomId) return;
    
    // Send via WebSocket
    sendSocketMessage(text);
  };

  const sidebarItems = [
    { label: "Dashboard", to: "/patient/dashboard", icon: homeIcon },
    { label: "Appointments", to: "/patient/appointments", icon: appointmentIcon },
    { label: "Chats", to: "/patient/chats", icon: chatsIcon },
    { label: "Blogs", to: "/patient/blogs", icon: blogIcon },
    { label: "Profile", to: "/patient/profile", icon: profileIcon },
  ];

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
          setSelected(null);
          dispatch(disconnectSocketAction());
          dispatch(clearCurrentChat());
        }}
      />
    </DashboardLayout>
  );
};

export default PatientChat;