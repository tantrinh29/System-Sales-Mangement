import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Layout from "../../components/Layout";
import { CUSTOM_ENV, RANDOM } from "../../utils/custom.env";
import Loading from "../../components/Loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppState } from "../../store";
import { AuthenticatedUser } from "../../types";
import { useSelector } from "react-redux";
import { chatService } from "../../services/chat.service";

type Props = {
  setLoadingBarProgress: any;
};

const chatTime = (dateString: any) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const ChatPage: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);

  const queryClient = useQueryClient();
  const user = useSelector(
    (state: AppState) => state.auth.user
  ) as AuthenticatedUser;

  const {
    data: isMessage,
    isLoading,
    isError,
  } = useQuery(["chats"], () => chatService.fetchAllChats(), {
    retry: 3,
    retryDelay: 1000,
  });

  const [currentMessage, setCurrentMessage] = useState<any>("");
  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any>();

  useEffect(() => {
    const socketInstance: any = io(CUSTOM_ENV.API_URL);
    setSocket(socketInstance);
    // unmouht
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user && user._id) {
      socket.emit("login", { userId: user._id });
    }
  }, [socket, user]);

  useEffect(() => {
    if (socket) {
      socket.on("update_online_users", (users: any) => {
        const filteredUsers = users.filter((_id: any) => _id !== user._id);
        console.log(filteredUsers)
        setOnlineUsers(filteredUsers);
      });
    }
  }, [socket]);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        userID: user?._id,
        author: user?.username,
        content: currentMessage,
      };
      await socket.emit("send_message", messageData);
      queryClient.invalidateQueries(["chats"]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket?.on("receive_message", (huydev: any) => {
      console.log("chat : ", huydev);
      queryClient.invalidateQueries(["chats"]);
    });
  }, []);

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div>Error loading data</div>
      ) : (
        <div className="h-screen">
          <div className="h-full flex flex-col">
            <div className="bg-white w-full  flex  border-b-[1px]  sm:px-4  py-3  px-4  lg:px-6  justify-between  items-center">
              <div className="flex gap-3 items-center">
                <a
                  className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer "
                  href="/conversations"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    height={32}
                    width={32}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <div className=" relative h-11 w-11 ">
                  <div
                    className="
  inline-block
  rounded-full
  overflow-hidden
  h-[21px]
  w-[21px]
  top-0 left-[12px]
  "
                  >
                    <img
                      alt="Avata"
                      loading="lazy"
                      decoding="async"
                      data-nimg="fill"
                      sizes="100vw"
                      src={`https://ui-avatars.com/api/name=${user.username}`}
                      style={{
                        position: "absolute",
                        borderRadius: "100%",
                        height: "100%",
                        width: "100%",
                        inset: 0,
                        color: "transparent",
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div>Chat Support</div>
                  <div className=" text-sm  font-light text-neutral-500 ">
                    Online
                  </div>
                </div>
              </div>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className=" text-sky-500  cursor-pointer  hover:text-sky-600  transition"
                height={32}
                width={32}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isMessage?.length > 0 ? (
                isMessage?.map((messageContent: any, index: number) => (
                  <React.Fragment key={index}>
                    <div
                      className={
                        user?.username === messageContent.author
                          ? "flex gap-3 p-4 justify-end"
                          : "flex gap-3 p-4"
                      }
                    >
                      <div
                        className={
                          user?.username === messageContent.author
                            ? "order-2"
                            : ""
                        }
                      >
                        <div className="relative">
                          <div className=" relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11 ">
                            <img
                              alt="Avatar"
                              loading="lazy"
                              decoding="async"
                              data-nimg="fill"
                              sizes="100vw"
                              src={`https://ui-avatars.com/api/name=${messageContent.author}`}
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: 0,
                                color: "transparent",
                              }}
                            />
                          </div>
                          {onlineUsers?.map((item: any, index: any) => (
                            <span
                              key={index}
                              className={
                                item === messageContent.userID._id
                                  ? "absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3"
                                  : ""
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <div
                        className={
                          user?.username === messageContent.author
                            ? "flex flex-col gap-2 items-end"
                            : "flex flex-col gap-2"
                        }
                      >
                        <div className=" flex items-center gap-1">
                          <div className="text-sm text-gray-500">
                            {messageContent.author}
                          </div>
                          <div className="text-xs text-gray-400">
                            {chatTime(messageContent.createdAt)}
                          </div>
                        </div>
                        <div className="text-sm w-fit overflow-hidden bg-sky-500 text-white rounded-full py-2 px-3">
                          <div>{messageContent.content}</div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <div className="flex justify-center pt-2">
                  Chưa Có Dữ Liệu ...
                </div>
              )}
            </div>

            <div className=" py-4  px-4  bg-white  border-t  flex  items-center  gap-2  lg:gap-4  w-full ">
              <button>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="text-sky-500"
                  height={30}
                  width={30}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-2 lg:gap-4 w-full">
                <div className="relative w-full ">
                  <input
                    id="message"
                    value={currentMessage}
                    onChange={(event) => {
                      setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                      event.key === "Enter" && sendMessage();
                    }}
                    className=" text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none "
                    name="message"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  className=" rounded-full  p-2  bg-sky-500  cursor-pointer  hover:bg-sky-600  transition "
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="text-white"
                    height={18}
                    width={18}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ChatPage;
