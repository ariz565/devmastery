import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface StudyRoom {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  maxMembers: number;
  roomCode: string;
  memberCount: number;
  owner: {
    name: string;
  };
  createdAt: string;
}

interface StudyRoomInvitation {
  id: string;
  message?: string;
  studyRoom: {
    name: string;
    roomCode: string;
  };
  sender: {
    name: string;
  };
  createdAt: string;
}

export default function StudyRoomDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "myRooms" | "joinRoom" | "invitations" | "createRoom"
  >("myRooms");
  const [myRooms, setMyRooms] = useState<StudyRoom[]>([]);
  const [invitations, setInvitations] = useState<StudyRoomInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Room Form State
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxMembers, setMaxMembers] = useState(10);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, isLoaded]);

  const fetchData = async () => {
    try {
      const [roomsRes, invitationsRes] = await Promise.all([
        fetch("/api/study-room/my-rooms"),
        fetch("/api/study-room/invitations"),
      ]);

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setMyRooms(roomsData);
      }

      if (invitationsRes.ok) {
        const invitationsData = await invitationsRes.json();
        setInvitations(invitationsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!roomName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/study-room/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roomName,
          description: roomDescription,
          isPrivate,
          maxMembers,
        }),
      });

      if (response.ok) {
        const newRoom = await response.json();
        router.push(`/study-room/${newRoom.roomCode}`);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setCreating(false);
    }
  };

  const joinRoomByCode = async () => {
    if (!joinCode.trim()) return;

    try {
      const response = await fetch("/api/study-room/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode: joinCode }),
      });

      if (response.ok) {
        router.push(`/study-room/${joinCode}`);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to join room");
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const respondToInvitation = async (invitationId: string, accept: boolean) => {
    try {
      const response = await fetch(
        `/api/study-room/invitations/${invitationId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accept }),
        }
      );

      if (response.ok) {
        fetchData(); // Refresh data
        if (accept) {
          const data = await response.json();
          router.push(`/study-room/${data.roomCode}`);
        }
      }
    } catch (error) {
      console.error("Error responding to invitation:", error);
    }
  };

  const filteredRooms = myRooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Room Dashboard</h1>
            <p className="text-purple-100">
              Collaborate, learn, and grow together
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
          {[
            { key: "myRooms", label: "My Rooms", count: myRooms.length },
            { key: "createRoom", label: "Create Room" },
            { key: "joinRoom", label: "Join Room" },
            {
              key: "invitations",
              label: "Invitations",
              count: invitations.length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === tab.key
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "myRooms" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Study Rooms</h2>
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">
                  No study rooms yet
                </h3>
                <p className="text-gray-400 mb-4">
                  Create your first study room to start collaborating!
                </p>
                <button
                  onClick={() => setActiveTab("createRoom")}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Your First Room
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold">{room.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          room.isPrivate ? "bg-red-600" : "bg-green-600"
                        }`}
                      >
                        {room.isPrivate ? "Private" : "Public"}
                      </span>
                    </div>

                    {room.description && (
                      <p className="text-gray-400 text-sm mb-4">
                        {room.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>
                        👥 {room.memberCount}/{room.maxMembers} members
                      </span>
                      <span>
                        📅 {new Date(room.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        href={`/study-room/${room.roomCode}`}
                        className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700 transition-colors"
                      >
                        Enter Room
                      </Link>
                      <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                        ⚙️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "createRoom" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Study Room</h2>

            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g., System Design Study Group"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  placeholder="Describe what this study room is for..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div>
                  <label
                    htmlFor="maxMembers"
                    className="block text-sm font-medium mb-2"
                  >
                    Max Members
                  </label>
                  <select
                    id="maxMembers"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    {[5, 10, 20, 50].map((num) => (
                      <option key={num} value={num}>
                        {num} members
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="privacy"
                    className="block text-sm font-medium mb-2"
                  >
                    Privacy
                  </label>
                  <select
                    id="privacy"
                    value={isPrivate.toString()}
                    onChange={(e) => setIsPrivate(e.target.value === "true")}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="false">Public</option>
                    <option value="true">Private</option>
                  </select>
                </div>
              </div>

              <button
                onClick={createRoom}
                disabled={!roomName.trim() || creating}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? "Creating..." : "Create Study Room"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "joinRoom" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Join Study Room</h2>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🔑</div>
                <h3 className="text-lg font-semibold mb-2">Enter Room Code</h3>
                <p className="text-gray-400">
                  Ask the room owner for the room code
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter room code (e.g., ABC123)"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-lg tracking-wider placeholder-gray-400"
                />

                <button
                  onClick={joinRoomByCode}
                  disabled={!joinCode.trim()}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "invitations" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Study Room Invitations</h2>

            {invitations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📨</div>
                <h3 className="text-xl font-semibold mb-2">No invitations</h3>
                <p className="text-gray-400">
                  You don't have any pending invitations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="bg-gray-800 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {invitation.studyRoom.name}
                        </h3>
                        <p className="text-gray-400 mb-2">
                          Invited by{" "}
                          <span className="text-white">
                            {invitation.sender.name}
                          </span>
                        </p>
                        {invitation.message && (
                          <p className="text-sm text-gray-300 mb-4 italic">
                            "{invitation.message}"
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(invitation.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() =>
                            respondToInvitation(invitation.id, true)
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            respondToInvitation(invitation.id, false)
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
