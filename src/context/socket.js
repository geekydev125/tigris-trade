import React from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect('https://seashell-app-dxaza.ondigitalocean.app/', {transports: ['websocket'] });

export const SocketContext = React.createContext();