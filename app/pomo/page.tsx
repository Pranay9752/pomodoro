"use client";
import React, { useState, useEffect, useRef, JSX } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Coffee,
  BookOpen,
  Trophy,
  X,
  Volume2,
  VolumeX,
  Heart,
  Star,
  Sparkles,
} from "lucide-react";

type Mode = "focus" | "shortBreak" | "longBreak";

interface PomodoroSettings {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  pomodorosUntilLongBreak: number;
}

export default function PomodoroTimer(): JSX.Element {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>("focus");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [totalFocusTime, setTotalFocusTime] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [settings, setSettings] = useState<PomodoroSettings>({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    pomodorosUntilLongBreak: 4,
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleTimerComplete();
            return 0;
          }
          return time - 1;
        });
        if (mode === "focus") {
          setTotalFocusTime((prev) => prev + 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const playSound = (): void => {
    if (!soundEnabled) return;

    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const handleTimerComplete = (): void => {
    setIsRunning(false);
    playSound();

    if (mode === "focus") {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);

      if (newCount % settings.pomodorosUntilLongBreak === 0) {
        setMode("longBreak");
        setTimeLeft(settings.longBreak * 60);
      } else {
        setMode("shortBreak");
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setMode("focus");
      setTimeLeft(settings.focusTime * 60);
    }
  };

  const toggleTimer = (): void => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = (): void => {
    setIsRunning(false);
    if (mode === "focus") {
      setTimeLeft(settings.focusTime * 60);
    } else if (mode === "shortBreak") {
      setTimeLeft(settings.shortBreak * 60);
    } else {
      setTimeLeft(settings.longBreak * 60);
    }
  };

  const switchMode = (newMode: Mode): void => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === "focus") {
      setTimeLeft(settings.focusTime * 60);
    } else if (newMode === "shortBreak") {
      setTimeLeft(settings.shortBreak * 60);
    } else {
      setTimeLeft(settings.longBreak * 60);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const progress: number =
    mode === "focus"
      ? ((settings.focusTime * 60 - timeLeft) /
          (settings.focusTime * 60)) *
        100
      : mode === "shortBreak"
      ? ((settings.shortBreak * 60 - timeLeft) /
          (settings.shortBreak * 60)) *
        100
      : ((settings.longBreak * 60 - timeLeft) /
          (settings.longBreak * 60)) *
        100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Subtle floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 text-3xl sm:text-4xl animate-pulse" style={{animationDuration: '4s'}}>✨</div>
        <div className="absolute top-20 sm:top-40 right-16 sm:right-32 text-2xl sm:text-3xl animate-pulse" style={{animationDuration: '5s'}}>🌸</div>
        <div className="absolute bottom-20 sm:bottom-40 left-16 sm:left-32 text-2xl sm:text-3xl animate-pulse" style={{animationDuration: '6s'}}>🦋</div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 text-3xl sm:text-4xl animate-pulse" style={{animationDuration: '4.5s'}}>⭐</div>
      </div>

      <div className="w-full max-w-lg relative z-10 pb-safe">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            pomodoro timer
          </h1>
          <p className="text-purple-300 font-medium flex items-center justify-center gap-2 text-sm sm:text-base">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            stay focused & productive
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          </p>
        </div>

        {/* Main Timer Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-5 sm:p-8 mb-4 sm:mb-6 border border-pink-100">
          {/* Mode Tabs */}
          <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8">
            <button
              onClick={() => switchMode('focus')}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-2xl font-semibold transition-all text-xs sm:text-base ${
                mode === 'focus' 
                  ? 'bg-gradient-to-r from-rose-300 to-pink-300 text-white shadow-lg' 
                  : 'bg-rose-50 text-rose-400 hover:bg-rose-100'
              }`}
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              Focus
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-2xl font-semibold transition-all text-xs sm:text-base ${
                mode === 'shortBreak' 
                  ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-white shadow-lg' 
                  : 'bg-purple-50 text-purple-400 hover:bg-purple-100'
              }`}
            >
              <Coffee className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Short Break</span>
              <span className="sm:hidden">Short</span>
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-2xl font-semibold transition-all text-xs sm:text-base ${
                mode === 'longBreak' 
                  ? 'bg-gradient-to-r from-pink-300 to-purple-300 text-white shadow-lg' 
                  : 'bg-pink-50 text-pink-400 hover:bg-pink-100'
              }`}
            >
              <Coffee className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Long Break</span>
              <span className="sm:hidden">Long</span>
            </button>
          </div>

          {/* Timer Display */}
          <div className="relative mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-full p-6 sm:p-8 border-2 border-pink-100">
              <svg className="w-full h-48 sm:h-64" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="#fce7f3"
                  strokeWidth="12"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 85}`}
                  strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
                  transform="rotate(-90 100 100)"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f9a8d4" />
                    <stop offset="50%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#f9a8d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl sm:text-7xl mb-2 sm:mb-3">
                  {mode === 'focus' ? '📖' : '☕'}
                </div>
                <div className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs sm:text-sm text-purple-300 mt-2 sm:mt-3 font-medium uppercase tracking-wider">
                  {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 sm:gap-4 justify-center mb-5 sm:mb-6">
            <button
              onClick={toggleTimer}
              className="bg-gradient-to-r from-rose-300 to-pink-300 text-white p-4 sm:p-5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
            >
              {isRunning ? <Pause className="w-6 h-6 sm:w-7 sm:h-7" /> : <Play className="w-6 h-6 sm:w-7 sm:h-7" />}
            </button>
            <button
              onClick={resetTimer}
              className="bg-purple-100 text-purple-400 p-4 sm:p-5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform hover:bg-purple-200"
            >
              <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-pink-100 text-pink-400 p-4 sm:p-5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform hover:bg-pink-200"
            >
              {soundEnabled ? <Volume2 className="w-6 h-6 sm:w-7 sm:h-7" /> : <VolumeX className="w-6 h-6 sm:w-7 sm:h-7" />}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-rose-100 text-rose-400 p-4 sm:p-5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform hover:bg-rose-200"
            >
              <Settings className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>

          {/* Pomodoro Counter */}
          <div className="flex gap-3 justify-center items-center">
            {[...Array(settings.pomodorosUntilLongBreak)].map((_, i) => (
              <div
                key={i}
                className={`transition-all ${
                  i < completedPomodoros % settings.pomodorosUntilLongBreak
                    ? 'w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full shadow-md'
                    : 'w-3 h-3 bg-pink-100 rounded-full'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-4 sm:p-6 border border-rose-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-rose-300" />
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-200" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent mb-1">
              {completedPomodoros}
            </div>
            <div className="text-xs sm:text-sm text-rose-300 font-medium">Pomodoros</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-4 sm:p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
              {formatTotalTime(totalFocusTime)}
            </div>
            <div className="text-xs sm:text-sm text-purple-300 font-medium">Focus Time</div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-pink-100 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                  Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-rose-300 hover:text-rose-400 bg-rose-50 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-rose-400 mb-2">
                    Focus Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.focusTime}
                    onChange={(e) => setSettings({...settings, focusTime: parseInt(e.target.value) || 25})}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-rose-100 focus:border-rose-300 outline-none bg-rose-50/50 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-400 mb-2">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.shortBreak}
                    onChange={(e) => setSettings({...settings, shortBreak: parseInt(e.target.value) || 5})}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-purple-100 focus:border-purple-300 outline-none bg-purple-50/50 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-pink-400 mb-2">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.longBreak}
                    onChange={(e) => setSettings({...settings, longBreak: parseInt(e.target.value) || 15})}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 focus:border-pink-300 outline-none bg-pink-50/50 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-rose-400 mb-2">
                    Pomodoros until Long Break
                  </label>
                  <input
                    type="number"
                    value={settings.pomodorosUntilLongBreak}
                    onChange={(e) => setSettings({...settings, pomodorosUntilLongBreak: parseInt(e.target.value) || 4})}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-rose-100 focus:border-rose-300 outline-none bg-rose-50/50 text-base"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSettings(false);
                  switchMode(mode);
                }}
                className="w-full mt-5 sm:mt-6 bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 text-white font-semibold py-3 sm:py-4 rounded-2xl hover:shadow-lg active:scale-95 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}