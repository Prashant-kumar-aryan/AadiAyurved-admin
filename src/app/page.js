"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const emojiOptions = ["🐶", "🐱", "🐵", "🦁", "🐸", "🐼"];

  const [currentEmoji, setCurrentEmoji] = useState("");
  const [targetEmoji, setTargetEmoji] = useState("");
  const [points, setPoints] = useState(0);
  const [showLoseDialog, setShowLoseDialog] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    startShuffle();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startShuffle = () => {
    clearInterval(intervalRef.current);

    setCurrentEmoji(
      emojiOptions[Math.floor(Math.random() * emojiOptions.length)]
    );
    setTargetEmoji(
      emojiOptions[Math.floor(Math.random() * emojiOptions.length)]
    );

    const shuffleEmoji = () => {
      setCurrentEmoji(
        emojiOptions[Math.floor(Math.random() * emojiOptions.length)]
      );
      const nextInterval = Math.floor(Math.random() * 600) + 200;
      intervalRef.current = setTimeout(shuffleEmoji, nextInterval);
    };

    shuffleEmoji();
  };

  const handleClick = () => {
    if (currentEmoji === targetEmoji) {
      setPoints(points + 10);
    } else {
      setPoints(0);
      setShowLoseDialog(true);
      // Hide the dialog after 3 seconds
      setTimeout(() => setShowLoseDialog(false), 3000);
    }

    // New target after each click
    setTargetEmoji(
      emojiOptions[Math.floor(Math.random() * emojiOptions.length)]
    );
  };

  const restartGame = () => {
    setPoints(0);
    startShuffle();
    setShowLoseDialog(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100 select-none">
      <h1 className="text-5xl font-extrabold mb-4 text-black drop-shadow-md">
        Let’s Play
      </h1>
      <h2 className="text-5xl font-semibold mb-8 text-gray-800 drop-shadow">
        Catch me if you can
      </h2>

      {/* Target Emoji */}
      <p className="text-2xl mb-4 text-gray-600">
        Target Animal <span className="text-4xl">{targetEmoji}</span>
      </p>

      {/* Emoji Box */}
      <button
        onClick={handleClick}
        className="w-40 h-40 flex items-center justify-center text-6xl border-4 border-dotted border-black rounded-xl bg-white shadow-lg hover:scale-110 transition-all"
      >
        {currentEmoji}
      </button>

      {/* Score */}
      <p className="mt-6 text-2xl font-bold text-black drop-shadow-md">
        Points: {points}
      </p>

      {/* Restart Button */}
      <button
        onClick={restartGame}
        className="mt-6 px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
      >
        Restart Game 🔄
      </button>

      {/* Lose Dialog */}
      {showLoseDialog && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white font-bold text-3xl px-8 py-4 rounded-xl shadow-lg animate-bounce">
          Oops! You Lose 😢
        </div>
      )}
    </div>
  );
}
