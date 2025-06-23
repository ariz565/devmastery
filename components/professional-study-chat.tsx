"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Crown,
  Users,
  Settings,
  Bell,
  Search,
  Pin,
  BookOpen,
  Calendar,
  FileText,
  Video,
  Mic,
  MicOff,
  Image as ImageIcon,
  Download,
  Play,
  Pause,
  UserPlus,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Member {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: string;
  joinedAt: string;
  isOnline?: boolean;
  lastSeen?: string;
  studyStreak?: number;
}

interface ChatMessage {
  id: string;
  content: string;
  messageType: "TEXT" | "FILE" | "IMAGE" | "AUDIO" | "VIDEO";
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface ProfessionalStudyChatProps {
  roomName: string;
  messages: ChatMessage[];
  members: Member[];
  currentUserId: string;
  onSendMessage: (content: string, type?: string, file?: File) => void;
  onFileUpload: (file: File, type: string) => void;
  onInviteUsers: () => void;
  onStartCall: () => void;
  onCopyRoomLink: () => void;
  isRecording?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  recordingTime?: number;
}

export default function ProfessionalStudyChat({
  roomName,
  messages,
  members,
  currentUserId,
  onSendMessage,
  onFileUpload,
  onInviteUsers,
  onStartCall,
  onCopyRoomLink,
  isRecording = false,
  onStartRecording,
  onStopRecording,
  recordingTime = 0,
}: ProfessionalStudyChatProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsTyping(true);
    onSendMessage(input.trim());
    setInput("");
    setTimeout(() => setIsTyping(false), 500);
  };

  const handleFileUpload = (type: string) => {
    const input = document.createElement("input");
    input.type = "file";

    switch (type) {
      case "IMAGE":
        input.accept = "image/*";
        break;
      case "AUDIO":
        input.accept = "audio/*";
        break;
      case "VIDEO":
        input.accept = "video/*";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "IMAGE":
        return <ImageIcon className="w-4 h-4" />;
      case "AUDIO":
        return <Mic className="w-4 h-4" />;
      case "VIDEO":
        return <Video className="w-4 h-4" />;
      default:
        return <Paperclip className="w-4 h-4" />;
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineMembers = members.filter((m) => m.isOnline).length;

  return (
    <TooltipProvider>
      <div className="flex h-full bg-gradient-to-br from-slate-50 to-blue-50 relative font-['Inter',_'system-ui',_'-apple-system',_'BlinkMacSystemFont',_'Segoe_UI',_'Roboto',_'sans-serif'] noise-bg-main">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 shadow-sm relative z-10 noise-bg-header">
            <div className="flex items-center justify-between">
              {" "}
              <div className="flex items-center space-x-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.history.back()}
                      className="text-slate-600 hover:text-slate-800"
                    >
                      ← Back
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Back to dashboard</TooltipContent>
                </Tooltip>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-800 tracking-tight font-['SF_Pro_Display',_'Inter',_'system-ui',_'sans-serif']">
                    {roomName}
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">
                    {members.length} members • {onlineMembers} online
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onStartCall}>
                      <Video className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Start video call</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onInviteUsers}>
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Invite members</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onCopyRoomLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy room link</TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pin className="w-4 h-4 mr-2" />
                      Pin important messages
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule study session
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Room settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-6 py-4 noise-bg-chat">
            <div className="space-y-4">
              {/* Welcome Message */}
              <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl p-4 mb-6 relative z-10 noise-bg-welcome">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800 font-['SF_Pro_Display',_'Inter',_'system-ui',_'sans-serif']">
                    Study Room Guidelines
                  </span>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed font-medium">
                  Welcome to {roomName}! Share resources, ask questions, and
                  help each other succeed. Collaborate effectively and make the
                  most of your study time together.
                </p>
              </div>

              {messages.map((message) => {
                const isOwnMessage = message.user.id === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[70%] ${
                        isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          className={
                            isOwnMessage
                              ? "bg-blue-500 text-white"
                              : "bg-purple-500 text-white"
                          }
                        >
                          {message.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-2xl px-4 py-3 relative z-10 ${
                          isOwnMessage
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm noise-bg-user-message"
                            : "bg-white/90 backdrop-blur-sm border border-slate-200/60 text-slate-800 shadow-sm noise-bg-ai-message"
                        }`}
                      >
                        {message.messageType === "TEXT" ? (
                          <p className="text-sm leading-relaxed font-medium">
                            {message.content}
                          </p>
                        ) : (
                          <div className="flex items-center space-x-2">
                            {getFileIcon(message.messageType)}
                            <div>
                              <p className="text-xs opacity-75 font-medium">
                                {message.messageType}
                              </p>
                              <p className="text-sm font-medium">
                                {message.fileName || "Media file"}
                              </p>
                              {message.fileUrl && (
                                <a
                                  href={message.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs underline opacity-75 hover:opacity-100 flex items-center gap-1 mt-1"
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                        <p
                          className={`text-xs mt-1 font-medium ${
                            isOwnMessage ? "text-blue-100" : "text-slate-500"
                          }`}
                        >
                          {getMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[70%]">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-500 text-white">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm noise-bg-typing">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="px-6 py-3 bg-red-50 border-t border-red-200">
              <div className="flex items-center justify-center space-x-3 p-3 bg-red-100 rounded-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium">
                  Recording... {formatTime(recordingTime)}
                </span>
                <Button
                  onClick={onStopRecording}
                  size="sm"
                  variant="outline"
                  className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                >
                  Stop
                </Button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white/95 backdrop-blur-sm border-t border-slate-200/60 px-6 py-4 relative z-10 noise-bg-input">
            <form onSubmit={handleSubmit} className="flex items-end space-x-3">
              <div className="flex space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileUpload("FILE")}
                      className="h-10 w-10 p-0"
                    >
                      <Paperclip className="w-4 h-4 text-slate-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileUpload("IMAGE")}
                      className="h-10 w-10 p-0"
                    >
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send image</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={isRecording ? onStopRecording : onStartRecording}
                      className={`h-10 w-10 p-0 ${
                        isRecording ? "text-red-500" : "text-slate-500"
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Record audio</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  placeholder="Type a message... (Shift+Enter for new line)"
                  disabled={isRecording}
                  rows={1}
                  className="resize-none border-slate-300/60 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/90 backdrop-blur-sm font-medium placeholder:font-medium placeholder:text-slate-400 noise-bg-input-field max-h-32"
                />
              </div>

              <Button
                type="submit"
                disabled={!input.trim() || isRecording}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl noise-bg-send-button h-auto"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white/95 backdrop-blur-sm border-l border-slate-200/60 flex flex-col relative z-10 noise-bg-sidebar">
          {/* Sidebar Header */}
          <div className="px-6 py-4 border-b border-slate-200/60 noise-bg-sidebar-header">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center tracking-tight font-['SF_Pro_Display',_'Inter',_'system-ui',_'sans-serif']">
                <Users className="w-5 h-5 mr-2" />
                Members
              </h2>
              <Badge
                variant="secondary"
                className="bg-blue-100/80 text-blue-700 font-medium noise-bg-badge"
              >
                {onlineMembers} online
              </Badge>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-300/60 focus:border-blue-500 focus:ring-blue-500 bg-white/90 backdrop-blur-sm font-medium placeholder:font-medium placeholder:text-slate-400 noise-bg-search"
              />
            </div>
          </div>

          {/* Members List */}
          <ScrollArea className="flex-1 px-6 py-4 noise-bg-members-list">
            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50/80 transition-colors backdrop-blur-sm noise-bg-member-card"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10 shadow-sm">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold">
                          {member.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                          member.isOnline ? "online" : "offline"
                        )} rounded-full border-2 border-white shadow-sm`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-slate-800 truncate tracking-tight">
                          {member.user.name}
                        </p>
                        {member.role === "OWNER" && (
                          <Crown className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-slate-500 capitalize font-medium">
                          {member.isOnline ? "online" : "offline"}
                        </p>
                        {!member.isOnline && member.lastSeen && (
                          <span className="text-xs text-slate-400 font-medium">
                            • {new Date(member.lastSeen).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      {member.studyStreak && (
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-xs text-slate-500 font-medium">
                            {member.studyStreak} day streak
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Send message</DropdownMenuItem>
                      {member.role !== "OWNER" && (
                        <>
                          <Separator />
                          <DropdownMenuItem className="text-red-600">
                            Remove from group
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-t border-slate-200/60 space-y-2 noise-bg-quick-actions">
            <Button
              variant="outline"
              className="w-full justify-start font-medium border-slate-300/60 hover:bg-slate-50/80 noise-bg-action-button"
              size="sm"
              onClick={() => handleFileUpload("FILE")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Share study materials
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start font-medium border-slate-300/60 hover:bg-slate-50/80 noise-bg-action-button"
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule group study
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
