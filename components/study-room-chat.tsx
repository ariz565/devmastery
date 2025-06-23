import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Video,
  MoreHorizontal,
  Plus,
  X,
  Check,
  CheckCheck,
  Users,
  Phone,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  messageType: "TEXT" | "FILE" | "IMAGE" | "AUDIO" | "VIDEO";
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  status?: "sending" | "sent" | "delivered" | "read";
}

interface Member {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface StudyRoomChatProps {
  messages: ChatMessage[];
  members: Member[];
  currentUserId: string;
  roomName: string;
  onSendMessage: (content: string, type?: string, file?: File) => void;
  onFileUpload: (file: File, type: string) => void;
  onInviteUsers: () => void;
  onStartCall: () => void;
  isRecording?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  recordingTime?: number;
}

export default function StudyRoomChat({
  messages,
  members,
  currentUserId,
  roomName,
  onSendMessage,
  onFileUpload,
  onInviteUsers,
  onStartCall,
  isRecording = false,
  onStartRecording,
  onStopRecording,
  recordingTime = 0,
}: StudyRoomChatProps) {
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [messageText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (type: string) => {
    const input = document.createElement("input");
    input.type = "file";

    switch (type) {
      case "image":
        input.accept = "image/*";
        break;
      case "video":
        input.accept = "video/*";
        break;
      case "audio":
        input.accept = "audio/*";
        break;
      default:
        input.accept = "*/*";
    }

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileUpload(file, type);
      }
    };

    input.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
        ? "audio"
        : "file";
      onFileUpload(file, type);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMessageStatus = (status?: string) => {
    switch (status) {
      case "sending":
        return (
          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
        );
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const onlineCount = members.filter((m) => m.isOnline).length;

  return (
    <div className="flex h-full bg-gray-900 text-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold">
                {roomName.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{roomName}</h2>
                <p className="text-sm text-gray-400">
                  {members.length} members • {onlineCount} online
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={onStartCall}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                onClick={onInviteUsers}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Users className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          className={cn(
            "flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar",
            isDragging &&
              "bg-blue-950/20 border-2 border-dashed border-blue-400"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-900/20 backdrop-blur-sm z-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center">
                  <Plus className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-blue-400 font-medium">
                  Drop files here to share
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isOwnMessage = message.user.id === currentUserId;
            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end space-x-2",
                  isOwnMessage ? "flex-row-reverse space-x-reverse" : "flex-row"
                )}
              >
                {!isOwnMessage && (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {message.user.avatar ? (
                      <img
                        src={message.user.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      message.user.name.charAt(0)
                    )}
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-xs lg:max-w-md",
                    isOwnMessage ? "items-end" : "items-start"
                  )}
                >
                  {!isOwnMessage && (
                    <p className="text-xs text-gray-400 mb-1 px-3">
                      {message.user.name}
                    </p>
                  )}

                  <div
                    className={cn(
                      "px-4 py-3 rounded-2xl relative",
                      isOwnMessage
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                        : "bg-gray-700 text-gray-100 rounded-bl-md"
                    )}
                  >
                    {message.messageType === "TEXT" ? (
                      <p className="text-sm break-words">{message.content}</p>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="text-lg">
                          {message.messageType === "IMAGE" && "🖼️"}
                          {message.messageType === "AUDIO" && "🎵"}
                          {message.messageType === "VIDEO" && "🎥"}
                          {message.messageType === "FILE" && "📎"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {message.fileName || "Media file"}
                          </p>
                          {message.fileSize && (
                            <p className="text-xs opacity-75">
                              {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                        {message.fileUrl && (
                          <a
                            href={message.fileUrl}
                            download={message.fileName}
                            className="text-xs bg-black/20 px-2 py-1 rounded hover:bg-black/30 transition-colors"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    )}

                    <div
                      className={cn(
                        "flex items-center justify-between mt-1 text-xs",
                        isOwnMessage ? "text-blue-100" : "text-gray-400"
                      )}
                    >
                      <span>{formatTime(message.createdAt)}</span>
                      {isOwnMessage && (
                        <div className="ml-2">
                          {getMessageStatus(message.status)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="px-4 py-2 bg-red-600/10 border-t border-red-600/20">
            <div className="flex items-center justify-center space-x-3 text-red-400">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Recording... {formatRecordingTime(recordingTime)}
              </span>
              <Button
                onClick={onStopRecording}
                size="sm"
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              >
                Stop
              </Button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-end space-x-3">
            {/* Attachment Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Plus className="w-5 h-5" />
              </Button>

              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 bg-gray-700 rounded-lg shadow-lg border border-gray-600 p-2">
                  <div className="grid grid-cols-4 gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileSelect("image")}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileSelect("file")}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileSelect("video")}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={isRecording ? onStopRecording : onStartRecording}
                      className={cn(
                        "p-2",
                        isRecording
                          ? "text-red-400 hover:text-red-300"
                          : "text-gray-400 hover:text-white"
                      )}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message... (Shift+Enter for new line)"
                disabled={isRecording}
                className="min-h-[48px] max-h-[120px] resize-none bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl pr-12"
                rows={1}
              />

              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-2 text-gray-400 hover:text-white"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isRecording}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-full p-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Members Sidebar */}
      <div className="w-80 bg-gray-800 border-l border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-semibold text-lg mb-2">Members</h3>
          <p className="text-sm text-gray-400">
            {members.length} total • {onlineCount} online
          </p>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 p-4 hover:bg-gray-700/50 transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-semibold">
                  {member.user.avatar ? (
                    <img
                      src={member.user.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    member.user.name.charAt(0)
                  )}
                </div>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800",
                    member.isOnline ? "bg-green-400" : "bg-gray-500"
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-medium truncate">{member.user.name}</p>
                  {member.role === "OWNER" && (
                    <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded-full">
                      Owner
                    </span>
                  )}
                  {member.role === "ADMIN" && (
                    <span className="px-2 py-1 bg-purple-600 text-purple-100 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  {member.isOnline ? (
                    <span className="text-green-400">● Online</span>
                  ) : (
                    `Last seen ${
                      member.lastSeen
                        ? new Date(member.lastSeen).toLocaleTimeString()
                        : "recently"
                    }`
                  )}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>{" "}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        aria-label="File upload input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const type = file.type.startsWith("image/") ? "image" : "file";
            onFileUpload(file, type);
          }
        }}
      />
    </div>
  );
}
