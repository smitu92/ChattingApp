import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";


export default function ChatWindow() {
  return (
    <div className="flex flex-col flex-1 p-4 space-y-4 overflow-y-auto">
      <ChatMessage/>
      <div className="mt-auto flex items-center space-x-2 border-t pt-4">
                <MessageInput/>
      </div>
    </div>
  );
}
