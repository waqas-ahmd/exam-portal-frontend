import io from "socket.io-client";
var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const ENDPOINT = "http://localhost:5000";
let socket;

const connectSocket = (userId) => {
  socket = io.connect(ENDPOINT, { ...connectionOptions, query: { userId } });
};
export { socket, connectSocket };
