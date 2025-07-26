import { io } from 'socket.io-client';

const socket = io('http://localhost:9099'); // only create 1 instance
export default socket;
