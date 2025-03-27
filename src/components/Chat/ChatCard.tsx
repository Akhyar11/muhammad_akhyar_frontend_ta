"use client";

import { useAuth } from "@/store/auth.store";
import { useUser } from "@/store/user.store";
import { axiosInstance } from "@/utils/axios.config";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const Chat = ({ message, user }: { message: string; user: "user" | "AI" }) => {
  const { getUser } = useUser();
  const userI = getUser();
  return (
    <div
      className={`flex items-start ${user === "user" ? "justify-end" : "justify-start"} gap-3`}
    >
      {user === "AI" && (
        <div className="relative h-10 w-10 rounded-full">
          <Image
            width={40}
            height={40}
            src="/images/AI-Icon.png"
            alt="AI"
            className="rounded-full"
          />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl ${user === "user" ? "rounded-tr-none bg-primary" : "rounded-tl-none bg-gray-2 dark:bg-meta-4"} p-4`}
      >
        <p
          className={`text-sm ${user === "user" ? "text-white" : "text-black dark:text-white"}`}
        >
          <ReactMarkdown>{message}</ReactMarkdown>
        </p>
      </div>

      {user === "user" && (
        <div className="relative h-10 w-10 rounded-full">
          {userI && (
            <Image
              src={userI.avatarUrl}
              onError={(e) =>
                ((e.target as any).src = "/images/icon/icon-user-man.jpg")
              }
              width={40}
              height={40}
              alt="User"
            />
          )}
        </div>
      )}
    </div>
  );
};

const ChatCard = () => {
  const [messages, setMessages] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [animation, setAnimation] = useState<ScrollBehavior>("instant");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const { getToken } = useAuth();
  const { me, getUser } = useUser();
  const user = getUser();
  const token = getToken();

  const fetchInitialMessages = async () => {
    try {
      if (user) {
        const response = await axiosInstance.get(
          `/convertation?userId=${user.id}&limit=9999`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );

        const chat: any = [];
        response.data.forEach((data: any) => {
          chat.push({ message: data.userMessage, user: "user" });
          chat.push({ message: data.AIMessage, user: "AI" });
        });

        setChatMessages(chat);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    // Prevent sending empty messages or while loading
    if (!messages.trim() || isLoading) return;

    try {
      if (user) {
        setIsLoading(true);
        setAnimation("smooth");

        // Add user message immediately
        const updatedChatMessages = [
          ...chatMessages,
          { message: messages, user: "user" },
        ];
        setChatMessages(updatedChatMessages);

        // Prepare for AI response
        const payload = {
          userMessage: messages,
          userId: user.id,
        };

        // Send message and get AI response
        const response = await axiosInstance.post("/convertation", payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // Add AI response
        const aiResponse = response.data.AIMessage;
        setChatMessages([
          ...updatedChatMessages,
          { message: aiResponse, user: "AI" },
        ]);

        // Reset input
        setMessages("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: animation });
  }, [chatMessages, animation]);

  // Fetch user data and initial messages
  useEffect(() => {
    me();
    fetchInitialMessages();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        BMI Intelligence
      </h4>

      <div className="flex h-[500px] flex-col">
        <div className="flex-1 overflow-y-auto px-7.5">
          <div className="space-y-4">
            {chatMessages.map((chat, index) => (
              <Chat key={index} message={chat.message} user={chat.user} />
            ))}
            <div ref={chatEndRef}></div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="mt-auto border-t border-stroke px-7.5 pt-4 dark:border-strokedark">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Ketik pesan Anda..."
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              value={messages}
              onKeyDown={(e) =>
                e.key === "Enter" && !isLoading && handleSendMessage()
              }
              onChange={(e) => setMessages(e.target.value)}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messages.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.8125 2.1875L2.1875 9.375L8.125 11.875M17.8125 2.1875L11.875 17.8125L8.125 11.875M17.8125 2.1875L8.125 11.875"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
