import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  connectSocket,
  getAdminMessages,
  getNotifications,
  getTeacherAccessCode,
  getUserAccess,
  loadUser,
  logout,
  readNotifications,
  sendMessage,
} from "../Store/Actions/UserActions";
import LinkContainer from "./LinkContainer";
import { BiLogOut } from "react-icons/bi";
import {
  VscBell,
  VscBellDot,
  VscColorMode,
  VscChromeClose,
} from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipsesSharp, IoSend } from "react-icons/io5";
// import { connectSocket, socket } from "../socket";
import NavIcon from "./NavIcon";
import RoundInput from "./RoundInput";

const Layout = ({ children }) => {
  const { notifications, userData, socket, userBlocked } = useSelector(
    (state) => state.users
  );
  const [darkMode, setDarkMode] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [msgNotification, setMsgNotification] = useState(false);

  const access = useSelector((state) => state.users.teacherAccess);

  const dispatch = useDispatch();

  const switchColors = () => {
    if (darkMode) {
      setDarkMode(false);
      document.body.classList.remove("darkmode");
    } else {
      setDarkMode(true);
      document.body.classList.add("darkmode");
    }
  };

  const handleSendMessage = async () => {
    await dispatch(sendMessage(newMessage));
    const data = await dispatch(getAdminMessages());
    setMessages(data);
    setNewMessage("");
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    if (access === 2 && userData) {
      (async () => {
        const data = await dispatch(getAdminMessages());
        setMessages(data);
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access]);

  useEffect(() => {
    dispatch(loadUser());
    if (userData) {
      dispatch(getNotifications());
      dispatch(getUserAccess());
    }
    if (userData && userData.role === "Teacher") {
      dispatch(getTeacherAccessCode());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatOpen]);

  useEffect(() => {
    if (userData) {
      (async () => {
        await dispatch(connectSocket());
      })();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData && socket) {
      socket.on("notification", async () => {
        await dispatch(getNotifications());
      });
    }
  }, [dispatch, socket, userData]);

  useEffect(() => {
    if (access === 2) {
      socket.on("newMessage", async () => {
        const data = await dispatch(getAdminMessages());
        setMessages(data);
        setMsgNotification(true);
      });
    }
  }, [access, socket, dispatch]);

  useEffect(() => {
    if (userData) {
      dispatch(getUserAccess());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(userBlocked);

  if (userBlocked) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          color: "red",
          fontSize: "large",
        }}
        className="fccc"
      >
        Your Account has been Blocked By the Admin
      </div>
    );
  }

  return (
    <>
      {profileModal && (
        <ProfileModal
          show={profileModal}
          onHide={() => setProfileModal(false)}
          user={userData}
        />
      )}

      {notificationModal && (
        <NotificationsModal
          show={notificationModal}
          onHide={() => setNotificationModal(false)}
          notifications={notifications}
        />
      )}

      {userData && userData.role === "Teacher" && access === 2 && (
        <>
          {chatOpen && (
            <div
              style={{
                background: "#ccc9",
                position: "fixed",
                bottom: 80,
                right: 20,
                height: "70vh",
                width: "90vw",
                maxWidth: "400px",
                borderRadius: 10,
                zIndex: 100,
                backdropFilter: "blur(5px)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0px 0px 8px #444",
              }}
            >
              <div
                style={{ height: "100%", width: "100%" }}
                className="p-3 fccc"
              >
                <div
                  className="w-100 fccc my-2 p-2"
                  style={{
                    backgroundColor: "#0009",
                    borderRadius: 5,
                    color: "#fff",
                  }}
                >
                  CHAT WITH ADMIN
                </div>

                <div
                  className="w-100 p-2 fcec"
                  style={{
                    display: "block",
                    overflowY: "scroll",
                    height: "100%",
                  }}
                >
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      style={{
                        width: "100%",
                      }}
                    >
                      <div
                        className={message.sender === 1 ? "mr-auto" : "ml-auto"}
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
              </div>
            </div>
          )}

          <div
            onClick={() => {
              setChatOpen(!chatOpen);
              setMsgNotification(false);
            }}
            style={{
              backgroundColor: chatOpen ? "#f44" : "#44f",
              transition: "all 0.3s linear",
              position: "fixed",
              bottom: 20,
              right: 20,
              height: 50,
              width: 50,
              borderRadius: 25,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              userSelect: "none",
              cursor: "pointer",
              zIndex: 100,
            }}
          >
            {chatOpen ? (
              <VscChromeClose size={30} color="white" />
            ) : (
              <IoChatbubbleEllipsesSharp size={30} color="white" />
            )}
            {msgNotification && !chatOpen && (
              <div
                style={{
                  position: "absolute",
                  height: 10,
                  width: 10,
                  backgroundColor: "red",
                  top: 3,
                  right: 3,
                  borderRadius: 20,
                }}
              ></div>
            )}
          </div>
        </>
      )}

      <Navbar
        variant={darkMode ? "dark" : "light"}
        expand="lg"
        className="py-1"
      >
        <Container>
          <LinkContainer to="/dashboard">
            <Navbar.Brand>Exam Portal</Navbar.Brand>
          </LinkContainer>

          <div className="ml-auto frcc">
            {userData ? (
              <>
                <NavIcon tip="Notifications">
                  <Nav.Link onClick={() => setNotificationModal(true)}>
                    {notifications.filter((n) => n.read === false).length >
                    0 ? (
                      <VscBellDot color="#ff4444" size={22} />
                    ) : (
                      <VscBell size={22} />
                    )}
                  </Nav.Link>
                </NavIcon>
                <NavIcon tip="Log Out">
                  <Nav.Link onClick={handleLogout}>
                    <BiLogOut size={22} />
                  </Nav.Link>
                </NavIcon>
                <NavIcon tip="Profile">
                  <Nav.Link onClick={() => setProfileModal(true)}>
                    <CgProfile size={22} />
                  </Nav.Link>
                </NavIcon>
              </>
            ) : null}
            <NavIcon tip={darkMode ? "Light Mode" : "Dark Mode"}>
              <Nav.Link onClick={switchColors}>
                <VscColorMode size={22} />
              </Nav.Link>
            </NavIcon>
          </div>
        </Container>
      </Navbar>
      <Container className="AppContainer">{children}</Container>
    </>
  );
};

export default Layout;

const NotificationsModal = ({ show, onHide, notifications }) => {
  const dispatch = useDispatch();
  const handleClose = async () => {
    await dispatch(readNotifications());
    onHide();
  };
  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header>
        <h5>Notifications</h5>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: "50vh", overflow: "auto" }}>
          {notifications.map((n, i) => (
            <LinkContainer to={n.link}>
              <div
                onClick={handleClose}
                key={i}
                style={{
                  backgroundColor: n.read ? "#fff8" : "#ffff",
                  padding: "10px 5px",
                  margin: "10px 4px",
                  borderRadius: 3,
                }}
              >
                {n.title}
              </div>
            </LinkContainer>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" block onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ProfileModal = ({ show, onHide, user }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <h5>My Profile</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="p-text">
          <div className="frsc py-1">
            <div style={{ width: 80 }}>Name: </div>
            <div>{`${user.firstname} ${user.lastname}`}</div>
          </div>
          <div className="frsc py-1">
            <div style={{ width: 80 }}>Email: </div>
            <div>{user.email}</div>
          </div>
          <div className="frsc py-1">
            <div style={{ width: 80 }}>Address: </div>
            <div>{user.address}</div>
          </div>
          <div className="frsc py-1">
            <div style={{ width: 80 }}>Phone: </div>
            <div>{user.phone}</div>
          </div>
          <div className="frsc py-1">
            <div style={{ width: 80 }}>Role:</div>
            <div>{user.role}</div>
          </div>
          <div className="frsc flex1 my-1">
            <LinkContainer to="/updateProfile" className="flex1 mr-1">
              <Button onClick={onHide} block>
                Update Profile
              </Button>
            </LinkContainer>
            <LinkContainer to="/reset" className="flex1 mr-1">
              <Button onClick={onHide} block>
                Reset Password
              </Button>
            </LinkContainer>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" block onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
