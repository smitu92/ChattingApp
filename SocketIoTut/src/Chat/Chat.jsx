/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import useStore from '../GlobalStore';
import socket from '../socket';
import { chatDB2 } from '../../IndexDb/NewDb/Chat';



export default function Chat({ selectedUser, currentUser }) {
    const [message, setMessage] = useState();
    const textareaRef = useRef(null);
    const addMessage = useStore((s) => s.addMessage)



    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        console.log('Send:', message, 'To:', selectedUser);
        const msgObj = {
            sender: currentUser,
            text: message,
            time: new Date().toLocaleTimeString(),
            _id: crypto.randomUUID(),
            status: false,
            receiver: selectedUser,
            isDelived: false,
            senderId: currentUser._id
        };


        // addMessage(msgObj);
        socket.emit("send_message", msgObj);
         const addmes = async () => {
                  
                        const result = await chatDB2.getIndexMessages("senderId", currentUser._id);
                        // console.log(result);
                        if (result) {
                            addMessage(result);

                        }
                  

                }
                addmes();


        /*  // this doent work due to version 1
        try {
            // const senderChats = await ChatDB.db.getAllFromIndex('chats', 'sender', 'smit');
            // console.log('Chats by sender:', senderChats);
            const store = ChatDB.db.transaction('chats').objectStore('chats');
            console.log([...store.indexNames]); // 🔍 Show available indexes
        } catch (err) {
            console.error('Error accessing index:', err);
        } */
        // After sending message
        // await ChatDB.addChat(msgObj);

        // const all = await ChatDB.getAllChats();
        // console.log('All:', all);

        // const tx = chatDB2.db.transaction("messages", "readonly");
        // const store = tx.objectStore("messages");
        // const index1= store.index("sender.id");
        // const index2= store.index("senderId");

        // const req = index1.getAll(23); // 23 is the sender.id you want
        // const req2 = index2.getAll(24); // 23 is the sender.id you want
        /*  this works
        const result=await chatDB2.getIndexMessages("senderId",currentUser._id);
        console.log("23",result);
        // */


        // req.onsuccess = () => {
        //     console.log("✅ Messages from Index1", req.result);
        // };
        // req2.onsuccess=()=>{console.log("✅ Messages from Index1", req2.result)};
        // req.onerror = (e) => {
        //     console.error("❌ Error getting messages by sender.id:", e.target.error);
        // };

        /* summary
                we can not use sender.id in IDB due its nature
                so we create simple object properties insread of nested
                db=indexDb.open("name",version);
                db.onupdateded(()=>{
                    // to create new Store 
                    //to create a new index 
                    but bumping of prev version is must 
                    })
        */
        setMessage('');



    };

    useEffect(() => {
        function handleReceive(data) {
            //     console.log(`📩 Received from ${data.user.name}:\n📨 ${data.text}`);
            //     const {metaData}=data;
            //     const {ReciverDetails}=metaData;
            //     console.log(metaData);
            //     console.log(data.user); //this emited data //sender //B
            //     console.log(selectedUser);   //to pair who are talking
            //     console.log(currentUser);  //reciver        //A

            //     if (data.user._id===selectedUser._id && ReciverDetails._id===currentUser._id) {   
            //         addMessage({...data,reciver:true}); // 💾 Also save to UI state if needed
            //         console.log("hellow");
            //     }
            // }


            const sender = data.sender;        // who sent the message (A)
            const receiver = data.receiver; // who should receive (B)

            console.log("Sender:", sender);
            console.log("Receiver:", receiver);
            console.log("Current User (me):", currentUser);
            console.log("Selected Chat:", selectedUser);



            // 🟢 You should receive a message if:
            // 1. It's sent TO you (receiver === currentUser)
            // 2. You're currently chatting WITH the sender (selectedUser === sender)
            if (
                receiver._id === currentUser?._id &&
                sender._id === selectedUser?._id
            ) {
                addMessage({ ...data, isDelived: true });
                const addmes = async () => {
                    await chatDB2.addMessage(data);
                  
                        const result = await chatDB2.getIndexMessages("senderId", selectedUser._id);
                        // console.log(result);
                        if (result) {
                            addMessage(result);

                        }
                  

                }
                addmes();

                console.log("✅ Message received and added IF");
            }
            else if (sender._id === currentUser?._id &&
                receiver._id === selectedUser?._id) {
                addMessage({ ...data, isDelived: true });
                console.log("✅ Message received and added elseIF");
            }
        }

        socket.on("receive_message", handleReceive);

        return () => {
            socket.off("receive_message", handleReceive); // ✅ Clean up
        };
    }, [addMessage, currentUser, selectedUser]);




    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };



    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex bg-white border rounded-lg px-3 py-2 shadow">
                <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder={
                        selectedUser ? 'Type a message...' : 'Select a user to chat'
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!selectedUser}
                    className="w-full resize-none text-black focus:outline-none text-lg placeholder-gray-400 disabled:bg-gray-100
             max-h-[200px] overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-gray-300"
                />

                <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 disabled:opacity-50"
                    disabled={!selectedUser}
                >
                    Send
                </button>
            </div>
        </form>
    );
}
