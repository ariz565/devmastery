import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import ProfessionalStudyChat from "@/components/professional-study-chat";

interface StudyRoom {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  maxMembers: number;
  roomCode: string;
  owner: {
    id: string;
    name: string;
  };
}

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

interface AvailableUser {
  id: string;
  name: string;
  email: string;
}

export default function StudyRoomPage() {
  const router = useRouter();
  const { roomCode } = router.query;
  const { user, isLoaded } = useUser();

  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Chat state
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Member invitation state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Media recording state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);

  // Generate room link for sharing
  const roomLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/study-room/${roomCode}`
      : "";

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    if (roomCode && user) {
      fetchRoomData();
      fetchAvailableUsers();

      // Simulate real-time updates (replace with WebSocket in production)
      const interval = setInterval(() => {
        fetchMessages();
        updateOnlineStatus();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [roomCode, user, isLoaded]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const fetchRoomData = async () => {
    try {
      const [roomRes, membersRes, messagesRes] = await Promise.all([
        fetch(`/api/study-room/${roomCode}`),
        fetch(`/api/study-room/${roomCode}/members`),
        fetch(`/api/study-room/${roomCode}/messages`),
      ]);

      if (roomRes.ok) {
        const roomData = await roomRes.json();
        setRoom(roomData);
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json(); // Simulate online status (in real app, this would come from WebSocket)
        const membersWithStatus = membersData.map((member: Member) => ({
          ...member,
          isOnline: Math.random() > 0.3, // Random online status for demo
          lastSeen: new Date(
            Date.now() - Math.random() * 3600000
          ).toISOString(),
          studyStreak: Math.floor(Math.random() * 30) + 1, // Random study streak for demo
        }));
        setMembers(membersWithStatus);
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/study-room/${roomCode}/messages`);
      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Mock users for demo - in production, implement proper user search API
      const mockUsers = [
        { id: "user1", name: "John Doe", email: "john@example.com" },
        { id: "user2", name: "Jane Smith", email: "jane@example.com" },
        { id: "user3", name: "Mike Johnson", email: "mike@example.com" },
        { id: "user4", name: "Sarah Wilson", email: "sarah@example.com" },
      ];
      setAvailableUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  };

  const updateOnlineStatus = () => {
    setMembers((prev) =>
      prev.map((member) => ({
        ...member,
        isOnline: Math.random() > 0.4, // Random for demo
        lastSeen: member.isOnline ? member.lastSeen : new Date().toISOString(),
      }))
    );
  };
  const sendMessage = async (
    content: string,
    messageType: "TEXT" | "FILE" | "IMAGE" | "AUDIO" | "VIDEO" = "TEXT",
    file?: File
  ) => {
    if ((!content.trim() && messageType === "TEXT") || sendingMessage) return;

    setSendingMessage(true);
    try {
      const formData = new FormData();

      if (messageType === "TEXT") {
        formData.append("content", content.trim());
        formData.append("messageType", "TEXT");
      } else {
        formData.append("messageType", messageType);
        if (file) {
          formData.append("file", file);
          formData.append("content", file.name || "Media file");
        }
      }

      const response = await fetch(`/api/study-room/${roomCode}/messages`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prev) => [...prev, message]);
        if (messageType === "TEXT") {
          setNewMessage("");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendMessage = (content: string, type?: string, file?: File) => {
    if (type && file) {
      sendMessage(content || file.name, type as any, file);
    } else {
      sendMessage(content);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        sendMessage(file.name, "AUDIO", file);
        setRecordingTime(0);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
    }
  };

  const sendInvitation = async () => {
    if ((!selectedUser && !inviteEmail.trim()) || sendingInvite) return;

    setSendingInvite(true);
    try {
      const response = await fetch(`/api/study-room/${roomCode}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser || undefined,
          email: inviteEmail || undefined,
          message: inviteMessage,
        }),
      });

      if (response.ok) {
        setShowInviteModal(false);
        setSelectedUser("");
        setInviteEmail("");
        setInviteMessage("");
        alert("Invitation sent successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
    } finally {
      setSendingInvite(false);
    }
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(roomLink);
    alert("Room link copied to clipboard!");
  };

  const filteredUsers = availableUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading study room...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Room not found</h2>
          <Link
            href="/study-room/dashboard"
            className="text-blue-400 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
      {/* Header/Navbar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg border-b border-gray-700 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/study-room/dashboard"
              className="text-white hover:text-gray-200 transition-colors"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-xl font-bold">{room.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <span>🏠 {room.roomCode}</span>
                <span>👥 {members.length} members</span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  {members.filter((m) => m.isOnline).length} online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              + Invite
            </button>
            <button
              onClick={copyRoomLink}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📋 Share Link
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Full Screen Chat Below Navbar */}
      <div className="flex-1 flex w-full overflow-hidden">
        <ProfessionalStudyChat
          roomName={room.name}
          messages={messages}
          members={members}
          currentUserId={user?.id || ""}
          onSendMessage={handleSendMessage}
          onFileUpload={(file, type) => {
            sendMessage(file.name, type as any, file);
          }}
          onInviteUsers={() => setShowInviteModal(true)}
          onStartCall={() => {
            // Implement video call functionality
            alert("Video call feature coming soon!");
          }}
          onCopyRoomLink={copyRoomLink}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          recordingTime={recordingTime}
        />
      </div>
      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Invite to Study Room</h3>

            <div className="space-y-4">
              {/* Invite by User Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select User
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      setShowUserSearch(true);
                    }}
                    onFocus={() => setShowUserSearch(true)}
                    placeholder="Search users by name or email..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                  {showUserSearch && filteredUsers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-lg mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredUsers.map((foundUser) => (
                        <button
                          key={foundUser.id}
                          onClick={() => {
                            setSelectedUser(foundUser.id);
                            setUserSearchQuery(foundUser.name);
                            setShowUserSearch(false);
                            setInviteEmail("");
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-600 transition-colors"
                        >
                          <div className="font-medium">{foundUser.name}</div>
                          <div className="text-sm text-gray-400">
                            {foundUser.email}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center text-gray-400">or</div>

              {/* Invite by Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setSelectedUser("");
                    setUserSearchQuery("");
                  }}
                  placeholder="Enter email address..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              {/* Personal Message */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setSelectedUser("");
                  setInviteEmail("");
                  setInviteMessage("");
                  setUserSearchQuery("");
                  setShowUserSearch(false);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendInvitation}
                disabled={
                  (!selectedUser && !inviteEmail.trim()) || sendingInvite
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sendingInvite ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
