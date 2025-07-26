// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import useStore from "../../GlobalStore";


// eslint-disable-next-line no-unused-vars
export default function Display({ selectedUser, currentUser }) {


    const messages = useStore((s) => s.messages);
    // const chatRoom=useStore((s)=>s.chatRoom);


    if (!messages) {
        return <><div>something wrong</div></>
    }

    return (
        <div className="flex flex-col gap-3">
            {messages?.map((msg, index) => (
                <div
                    key={index}
                    className={`max-w-[50%]  text-neutral-700  rounded-xl  px-4 py-3 shadow-md ${msg?.isDelived ?  "self-start bg-emerald-200": "self-end bg-cyan-500"} `}
                >
                    <p className=" leading-relaxed break-words font-extrabold text-lg">
                        {msg.text}
                    </p>
                    <div className="text-right text-xs mt-1 text-white/80">
                        {msg.time}
                    </div>
                </div>
            ))}
        </div>
    );
}
