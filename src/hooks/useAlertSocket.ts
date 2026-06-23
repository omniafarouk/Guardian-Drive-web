import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../services/apiService";

// Initialize the socket instance outside the hook scope to prevent re-connections on re-renders
const SOCKET_URL = `${BASE_URL}/alerts`; // Replace with your actual backend URL
const socket: Socket = io(SOCKET_URL, { autoConnect: false });

// interface UseAlertSocketProps {
//     fleetManagerId: string | number | undefined;
//     onAlertReceived: (alertData: any) => void;
// }

// export function useAlertSocket({ fleetManagerId, onAlertReceived }: UseAlertSocketProps) {
//     useEffect(() => {
//         if (!fleetManagerId) return;

//         // 1. Establish the connection cleanly
//         socket.connect();

//         // 2. Join the targeted room for this manager
//         socket.emit("join_manager_room", fleetManagerId);

//         // 3. Listen for incoming live stream payloads
//         socket.on("new_alert", (payload) => {
//             console.log("Real-time alert intercepted:", payload);
//             if (payload?.data) {
//                 onAlertReceived(payload.data);
//             }
//         });

//         // 4. Cleanup the socket event listeners on unmount
//         return () => {
//             socket.off("new_alert");
//             socket.disconnect();
//         };
//     }, [fleetManagerId, onAlertReceived]);
// }


interface UseAlertSocketProps {
    fleetManagerId: string | number | undefined;
    onAlertReceived: (alertData: any) => void;
}

export function useAlertSocket({ fleetManagerId, onAlertReceived }: UseAlertSocketProps) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!fleetManagerId) return;

        // 🌟 Initialize the socket instance safely inside the hook context
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:3000", {
                autoConnect: false,
                transports: ["websocket", "polling"] // Fallback handling
            });
        }

        const socket = socketRef.current;

        // 🌟 Only connect if it's currently disconnected
        if (!socket.connected) {
            socket.connect();
        }

        // Join the specified room
        socket.emit("join_manager_room", fleetManagerId);

        // Event listener tracking
        socket.on("new_alert", (payload) => {
            console.log("Real-time alert intercepted:", payload);

            if (payload?.data) {
                onAlertReceived(payload.data);
            }
        });

        // 🌟 Clean cleanup block to completely tear down listeners on unmount
        return () => {
            socket.off("new_alert");
            socket.disconnect();
        };
    }, [fleetManagerId, onAlertReceived]);
}