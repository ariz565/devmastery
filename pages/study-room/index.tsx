import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RetroGrid } from "../../components/magicui/retro-grid";

export default function StudyRoomEntrance() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState("Initializing Study Room...");

  const loadingTexts = [
    "Initializing Study Room...",
    "Setting up collaboration tools...",
    "Preparing chat system...",
    "Loading file sharing...",
    "Configuring video calls...",
    "Welcome to Study Room!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push("/study-room/dashboard");
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    const textIndex = Math.floor((progress / 100) * (loadingTexts.length - 1));
    setCurrentText(loadingTexts[textIndex]);
  }, [progress]);

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Retro Grid Background */}
      <RetroGrid />

      {/* Loading Content */}
      <div className="relative z-10 text-center text-white">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
            <span className="text-4xl">🏠</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Study Room
          </h1>
        </div>{" "}
        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-2">
            {progress.toFixed(0)}%
          </div>
        </div>
        {/* Loading Text */}
        <div className="text-lg text-gray-300 animate-pulse">{currentText}</div>
        {/* Additional Visual Elements */}
        <div className="mt-8 flex justify-center space-x-4">
          <div className="w-3 h-3 bg-purple-500 rounded-full study-room-bounce-1" />
          <div className="w-3 h-3 bg-blue-500 rounded-full study-room-bounce-2" />
          <div className="w-3 h-3 bg-purple-500 rounded-full study-room-bounce-3" />
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 study-room-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
