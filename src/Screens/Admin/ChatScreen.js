import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DashboardCard from "../../Components/DashboardCard";
import {
  adminReply,
  getAllAdminMessages,
  readAdminChat,
} from "../../Store/Actions/UserActions";
import RoundInput from "../../Components/RoundInput";
import { IoSend, IoCloseCircleOutline } from "react-icons/io5";

const ChatScreen = () => {
  const [adminConversations, setAdminConversations] = useState([]);
  const [chatModal, setChatModal] = useState(false);
  const [selected, setSelected] = useState();
  const [messageSent, setMessageSent] = useState(true);

  const { socket } = useSelector((state) => state.users);

  const handleSendMessage = async (msg) => {
    await dispatch(adminReply(msg, selected));
    setTimeout(() => {
      setMessageSent(!messageSent);
    }, 100);
  };

  const openChat = async (chat) => {
    setSelected(chat.userId);

    setChatModal(true);
    const data = await dispatch(readAdminChat(chat.userId));
    if (data.success) {
      const data = await dispatch(getAllAdminMessages());
      setAdminConversations(data);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const data = await dispatch(getAllAdminMessages());
      setAdminConversations(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageSent]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", async () => {
        const data = await dispatch(getAllAdminMessages());
        setAdminConversations(data);
      });
    }
  }, [dispatch, socket]);
  return (
    <div className="fcsc w-100">
      {chatModal && (
        <ChatModal
          chat={adminConversations.find(
            (c) => c.userId.toString() === selected.toString()
          )}
          show={chatModal}
          onHide={() => setChatModal(false)}
          sendMessage={handleSendMessage}
        />
      )}
      <h4 className="t-bold p-3 m-3">MESSAGES</h4>
      <div className="fcsc w-100">
        {adminConversations
          .sort((a, b) =>
            new Date(a.lastUpdated).toISOString() >
            new Date(b.lastUpdated).toISOString()
              ? -1
              : 1
          )
          .map((conv, id) => (
            <div className="w-100" key={id} onClick={() => openChat(conv)}>
              <DashboardCard>
                <div className="frsc">
                  {!conv.messages[conv.messages.length - 1].read &&
                    conv.messages[conv.messages.length - 1].sender === 0 && (
                      <div
                        style={{
                          height: 7,
                          width: 7,
                          backgroundColor: "red",
                          borderRadius: 10,
                          marginRight: 5,
                        }}
                      ></div>
                    )}
                  <div className="t-bold">{conv.userName}</div>
                  <div className="ml-2" style={{ fontSize: "small" }}>
                    {conv.messages[conv.messages.length - 1].text.slice(0, 30)}
                    ...
                  </div>
                </div>
              </DashboardCard>
            </div>
          ))}
      </div>
    </div>
  );
};

const ChatModal = ({ show, onHide, chat, sendMessage }) => {
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <div className="frsbc w-100">
          <div> {chat.userName}</div>
          <IoCloseCircleOutline onClick={onHide} color="#f44" size={24} />
        </div>
      </Modal.Header>
      <Modal.Body>
        <div
          className="w-100 p-2 fcec"
          style={{
            display: "block",
            overflowY: "scroll",
            height: "60vh",
          }}
        >
          {chat.messages.map((message, index) => (
            <div
              key={index}
              style={{
                width: "100%",
              }}
            >
              <div
                className={message.sender === 0 ? "mr-auto" : "ml-auto"}
                style={{
                  backgroundColor: "white",
                  width: "fit-content",
                  padding: "3px 7px",
                  margin: "3px 0px",
                  borderRadius: 4,
                  maxWidth: "60%",
                }}
              >
                {message.text}
              </div>
              <div ref={messagesEndRef} />
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="frcc w-100 mt-2">
          <RoundInput className="flex1" style={{ borderRadius: 3 }}>
            <textarea
              style={{ resize: "none", fontSize: "smaller" }}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={2}
            />
          </RoundInput>
          <div className="ml-3" onClick={handleSendMessage}>
            <IoSend size={25} color="#333" />
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatScreen;
