"use client";

import { useAuth } from "@/store/auth.store";
import { useUser } from "@/store/user.store";
import { axiosInstance } from "@/utils/axios.config";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const Chat = ({ message, user }: { message: string; user: "user" | "AI" }) => {
  return (
    <div
      className={`flex items-start ${user === "user" ? "justify-end" : "justify-start"} gap-3`}
    >
      {user === "AI" && (
        <div className="relative h-10 w-10 rounded-full">
          <Image
            width={40}
            height={40}
            src="/images/user/user-01.png"
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
          <Image
            width={40}
            height={40}
            src="/images/user/user-02.png"
            alt="User"
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
};

const ChatCard = () => {
  const [messages, setMessages] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [animation, setAnimation] = useState<ScrollBehavior>("instant");
  const chatEndRef = useRef<HTMLDivElement | null>(null); // Tambahkan useRef

  const { getToken } = useAuth();
  const { user, me, loading } = useUser();
  const token = getToken();

  const getMessage = async () => {
    try {
      const response = await axiosInstance.get(
        `/convertation?userId=${(user as any).id}&limit=9999`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const chat: any = [];
      response.data.forEach((data: any) => {
        chat.push({ message: data.userMessage, user: "user" });
        chat.push({ message: data.AIMessage, user: "AI" });
      });

      setChatMessages(chat);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async () => {
    const chat: any = [];
    try {
      setAnimation("smooth");
      chat.push({ message: messages, user: "user" });
      setChatMessages([...chatMessages, { message: messages, user: "user" }]);
      setMessages("");

      const response = await axiosInstance.post(
        "/convertation",
        { userMessage: messages, userId: (user as any).id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      chat.push({ message: response.data.AIMessage, user: "AI" });
      await getMessage();
    } catch (error) {
      console.log(error);
    }
  };

  // Gunakan useEffect untuk scroll ke bawah saat chatMessages berubah
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: animation });
  }, [chatMessages]);

  useEffect(() => {
    me();
  }, []);

  useEffect(() => {
    if ((user as any).id) {
      setAnimation("instant");
      getMessage();
    }
  }, [(user as any).id]);

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
            {/* Elemen dummy untuk scroll ke bawah */}
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
                loading.read && e.key === "Enter" && handleSendMessage()
              }
              onChange={(e) => setMessages(e.target.value)}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!loading.read}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white hover:bg-opacity-90"
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
