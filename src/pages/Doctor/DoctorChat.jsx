import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import {
  connectSocketAction,
  disconnectSocketAction,
  sendLiveMessage,
} from "../../redux/features/socketSlice";
import {
  fetchChatDoctors,
  fetchChatPatients,
  fetchChatHistory,
} from "../../redux/features/chatSlice";
//import AiChatModal from "../shared/AiChatModal";
// const AiChatModal = ({ isOpen, onClose, ...props }) => {
//   if (!isOpen) return null;
  
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">AI Chat Assistant</h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             ✕
//           </button>
//         </div>
//         <div className="text-center py-8">
//           <p className="text-gray-600">AI Chat feature coming soon!</p>
//           <button 
//             onClick={onClose}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

const DoctorChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatDoctors, chatPatients, currentChat } = useSelector(
    (state) => state.chat
  );
  //const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(connectSocketAction(user.id));
      dispatch(fetchChatDoctors());
      dispatch(fetchChatPatients());
    }
    return () => dispatch(disconnectSocketAction());
  }, [dispatch, user?.id]);

  const handleSelectChat = (chat) => {
    if (chat.id) dispatch(fetchChatHistory(chat.id));
  };

  const handleSendMessage = async (text, receiverId) => {
    dispatch(sendLiveMessage({ sender: user.id, receiver: receiverId, text }));
    if (receiverId)
      await axiosInstance.post(`/chat/rooms/${receiverId}/messages/`, {
        content: text,
      });
  };

  const sidebarItems = [
    { label: "Dashboard", to: "/doctor/dashboard", icon: "📊" },
    { label: "Appointment", to: "/doctor/appointments", icon: "📅" },
    { label: "Chat", to: "/doctor/chat", icon: "💬" },
    { label: "Blogs", to: "/doctor/community", icon: "📝" },
    { label: "Profile", to: "/doctor/profile", icon: "👤" },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="doctor">
      <ChatLayout
        role="doctor"
        userName={`Dr. ${user?.first_name || ""}`}
        doctors={chatDoctors}
        patients={chatPatients}
        currentChat={currentChat}
        onSelectChat={handleSelectChat}
        onSendMessage={handleSendMessage}
        //onOpenAiChat={() => setShowAiModal(true)}
      />
      {/* {showAiModal && <AiChatModal onClose={() => setShowAiModal(false)} />} */}
    </DashboardLayout>
  );
};

export default DoctorChat;
