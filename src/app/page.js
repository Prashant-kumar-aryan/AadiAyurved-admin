"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const emojiOptions = ["🐶", "🐱", "🐵", "🦁", "🐸", "🐼"];
  const levelIntervals = {
    Easy: 900,
    Medium: 700,
    Hard: 600,
    Impossible: 200,
  };

  const [currentEmoji, setCurrentEmoji] = useState("");
  const [targetEmoji, setTargetEmoji] = useState("");
  const [points, setPoints] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showLoseDialog, setShowLoseDialog] = useState(false);
  const [level, setLevel] = useState("Easy"); // default level
  const intervalRef = useRef(null);

  useEffect(() => {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) setHighScore(parseInt(storedHighScore));
    startShuffle();
    return () => clearInterval(intervalRef.current);
  }, [level]); // restart shuffle if level changes

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
      const nextInterval = levelIntervals[level];
      intervalRef.current = setTimeout(shuffleEmoji, nextInterval);
    };

    shuffleEmoji();
  };

  const handleClick = () => {
    if (currentEmoji === targetEmoji) {
      const newPoints = points + 10;
      setPoints(newPoints);

      if (newPoints > highScore) {
        setHighScore(newPoints);
        localStorage.setItem("highScore", newPoints);
      }
    } else {
      setPoints(0);
      setShowLoseDialog(true);
      setTimeout(() => setShowLoseDialog(false), 3000);
    }

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
      {/* Score Display */}
      <div className="absolute top-4 right-4 flex gap-6 text-xl font-bold text-black drop-shadow-md">
        <span>Score: {points}</span>
        <span>High Score: {highScore}</span>
      </div>

      <h1 className="text-5xl font-extrabold mb-4 text-black drop-shadow-md">
        Let’s Play
      </h1>
      <h2 className="text-5xl font-semibold mb-8 text-gray-800 drop-shadow">
        Catch me if you can
      </h2>

      {/* Level Selection */}
      <div className="flex gap-4 mb-6">
        {["Easy", "Medium", "Hard", "Impossible"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              level === lvl
                ? "bg-black text-white"
                : "bg-white text-black border-2 border-black"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

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
