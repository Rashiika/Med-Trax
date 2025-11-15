import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import DoctorConnectionManager from "../../components/shared/DoctorConnectionManager";
import homeIcon from "../../assets/dashboard.svg";
import appointmentIcon from "../../assets/appointment.svg";
import chatsIcon from "../../assets/chat.svg";
import profileIcon from "../../assets/profile.svg";
import blogIcon from "../../assets/blog.svg";
import prescriptionIcon from "../../assets/Prescription.svg";
import {
  connectSocketAction,
  disconnectSocketAction,
} from "../../redux/features/socketSlice";
import {
  fetchDoctorPatients,
  fetchDoctorDoctors,
  fetchChatRoomDetails,
  clearCurrentChat,
} from "../../redux/features/chatSlice";
import { sendSocketMessage } from "../../utils/socket";

const DoctorChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { doctorPatients, doctorDoctors, currentMessages } = useSelector(
    (state) => state.chat
  );
  const [showAiChat, setShowAiChat] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  // In DoctorChat.jsx, update useEffect:

useEffect(() => {
    if (user?.id) {
      console.log("🔄 Fetching doctor's chat lists...");
      dispatch(fetchDoctorPatients()).then((result) => {
        console.log("✅ Doctor's patients:", result.payload);
      });
      dispatch(fetchDoctorDoctors()).then((result) => {
        console.log("✅ Doctor's doctor chats:", result.payload);
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
    { label: "Dashboard", to: "/doctor/dashboard", icon: homeIcon },
    { label: "Appointments", to: "/doctor/appointments", icon: appointmentIcon },
    { label: "Chats", to: "/doctor/chats", icon: chatsIcon },
    { label: "Blogs", to: "/doctor/blogs", icon: blogIcon },
    { label: "Prescription", to: "/doctor/prescription", icon: prescriptionIcon },
    { label: "Profile", to: "/doctor/profile", icon: profileIcon },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="doctor">
      <ChatLayout
        role="doctor"
        userName={`Dr. ${user?.first_name || ""}`}
        doctors={doctorDoctors}
        patients={doctorPatients}
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

export default DoctorChat;