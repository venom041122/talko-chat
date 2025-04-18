import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isSender = message.senderId?.toString() === authUser._id?.toString();

          return (
            <div
              key={message._id || index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="max-w-[70%]">
                <div
                  className={`flex items-center gap-2 ${
                    isSender ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full border overflow-hidden">
                    <img
                      src={
                        isSender
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <time className="text-xs opacity-50">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                <div
                  className={`px-4 py-2 mt-1 rounded-lg break-words ${
                    isSender
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
