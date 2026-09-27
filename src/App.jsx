import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import {
  Sparkles,
  Play,
  Trophy,
  BarChart3,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Share2,
  Users,
  Zap,
  Flame,
  Award,
  ArrowRight,
  RotateCcw,
  Layers,
  Check
} from 'lucide-react';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    selectedQuizId,
    setSelectedQuizId,
    quizzes,
    gameState,
    currentQuestionIndex,
    timeRemaining,
    score,
    streak,
    selectedAnswer,
    isCorrect,
    livePin,
    players,
    startLiveGame,
    beginQuestion,
    submitAnswer,
    nextQuestion,
    addQuiz
  } = useStore();

  const [copiedPin, setCopiedPin] = useState(false);

  // Quiz Builder Local State
  const [buildTitle, setBuildTitle] = useState('');
  const [buildCategory, setBuildCategory] = useState('Science');
  const [buildDifficulty, setBuildDifficulty] = useState('Medium');
  const [buildQuestions, setBuildQuestions] = useState([
    {
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      timeLimit: 15,
      points: 1000
    }
  ]);

  const activeQuiz = quizzes.find(q => q.id === selectedQuizId) || quizzes[0];
  const currentQ = activeQuiz?.questions[currentQuestionIndex];

  // Timer simulation
  useEffect(() => {
    let interval = null;
    if (gameState === 'playing' && timeRemaining > 0) {
      interval = setInterval(() => {
        useStore.setState((state) => ({
          timeRemaining: Math.max(0, state.timeRemaining - 1)
        }));
      }, 1000);
    } else if (gameState === 'playing' && timeRemaining === 0 && selectedAnswer === null) {
      submitAnswer(-1); // Timeout
    }
    return () => clearInterval(interval);
  }, [gameState, timeRemaining, selectedAnswer]);

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(livePin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleAddQuestionToBuilder = () => {
    setBuildQuestions([
      ...buildQuestions,
      {
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        timeLimit: 15,
        points: 1000
      }
    ]);
  };

  const handleSaveQuiz = (e) => {
    e.preventDefault();
    if (!buildTitle.trim()) return;
    addQuiz({
      title: buildTitle,
      category: buildCategory,
      difficulty: buildDifficulty,
      cover: '⚡',
      author: 'Creator',
      questions: buildQuestions.filter(q => q.question.trim().length > 0)
    });
    setBuildTitle('');
    setBuildQuestions([
      {
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        timeLimit: 15,
        points: 1000
      }
    ]);
  };

  const answerColors = [
    'bg-rose-500 hover:bg-rose-600 border-b-4 border-rose-700 text-white',
    'bg-sky-500 hover:bg-sky-600 border-b-4 border-sky-700 text-white',
    'bg-amber-500 hover:bg-amber-600 border-b-4 border-amber-700 text-white',
    'bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 text-white'
  ];

  const answerIcons = ['▲', '◆', '●', '■'];

  return (
    <div className="min-h-screen bg-[#2e0854] text-white font-sans flex flex-col selection:bg-yellow-400 selection:text-purple-950">
      {/* Top Game-Show Navigation */}
      <header className="bg-[#1e0836] border-b border-purple-800/60 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-purple-950 font-black shadow-lg shadow-yellow-500/30 text-xl">
              ⚡
            </div>
            <div>
              <span className="font-black text-xl text-yellow-400 tracking-wide block leading-tight">QuizVortex</span>
              <span className="text-[10px] text-purple-300 font-mono font-bold tracking-wider uppercase">
                SYNCHRONOUS MULTIPLAYER GAME SHOW
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 bg-[#2e0854]/80 p-1.5 rounded-2xl border border-purple-700/50 text-xs font-bold">
              <button
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'library'
                    ? 'bg-yellow-400 text-purple-950 shadow-md font-black'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" /> Quizzes
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'builder'
                    ? 'bg-yellow-400 text-purple-950 shadow-md font-black'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Creator Studio
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'analytics'
                    ? 'bg-yellow-400 text-purple-950 shadow-md font-black'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Analytics
              </button>
            </nav>

            <div className="hidden sm:flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1.5 rounded-xl font-mono text-xs text-yellow-300 font-bold">
              <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>PIN: {livePin}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* QUIZ LIBRARY TAB */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-purple-800/60 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-tight">Interactive Arena Catalog</h1>
                <p className="text-xs sm:text-sm text-purple-300">Choose a high-octane quiz arena or initiate synchronous live host mode</p>
              </div>

              <button
                onClick={() => setActiveTab('builder')}
                className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 rounded-2xl font-black text-xs shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4" /> Create New Quiz
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-[#1e0836] border-2 border-purple-800/80 hover:border-yellow-400 rounded-3xl p-6 shadow-xl transition space-y-5 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-3 bg-purple-900/60 rounded-2xl border border-purple-700/50">{quiz.cover}</span>
                      <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-xs font-mono font-bold rounded-full border border-yellow-400/30">
                        {quiz.difficulty}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">{quiz.category}</span>
                      <h3 className="text-lg font-black text-white group-hover:text-yellow-300 transition leading-snug mt-1">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-purple-300 mt-1 font-medium">By {quiz.author}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-[#2e0854]/60 p-3 rounded-2xl border border-purple-800/50 text-center text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-purple-400 block">Questions</span>
                        <span className="font-bold text-white text-sm">{quiz.questions.length} Qs</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-400 block">Plays</span>
                        <span className="font-bold text-yellow-400 text-sm">{quiz.plays}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-400 block">Avg Score</span>
                        <span className="font-bold text-emerald-400 text-sm">{quiz.avgScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => startLiveGame(quiz.id)}
                      className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition"
                    >
                      <Play className="w-4 h-4 fill-purple-950" /> Launch Arena
                    </button>
                    <button
                      onClick={handleCopyPin}
                      className="p-3 bg-purple-900/60 hover:bg-purple-800 border border-purple-700/50 rounded-2xl text-purple-200 hover:text-white transition"
                      title="Copy Game Pin"
                    >
                      {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVE GAME SHOW ARENA */}
        {activeTab === 'live-game' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* LOBBY STATE */}
            {gameState === 'lobby' && (
              <div className="bg-[#1e0836] border-2 border-purple-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-8">
                <div className="space-y-2">
                  <span className="px-4 py-1.5 bg-yellow-400 text-purple-950 font-black text-xs uppercase tracking-widest rounded-full shadow-md">
                    LIVE LOBBY WAITING ROOM
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-yellow-400 mt-2">{activeQuiz?.title}</h2>
                  <p className="text-sm text-purple-300 font-mono">Share PIN with participants to join the live room</p>
                </div>

                {/* Big PIN display */}
                <div className="bg-purple-950/80 border-2 border-yellow-400/50 p-6 rounded-3xl max-w-sm mx-auto shadow-inner space-y-2">
                  <span className="text-xs font-mono text-purple-300 font-bold uppercase">GAME ROOM PIN</span>
                  <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-yellow-300 animate-pulse">
                    {livePin}
                  </div>
                  <button
                    onClick={handleCopyPin}
                    className="text-xs font-bold text-yellow-400 hover:underline flex items-center justify-center gap-1 mx-auto pt-1"
                  >
                    {copiedPin ? 'Copied to Clipboard!' : 'Click to Copy Join Link'}
                  </button>
                </div>

                {/* Joined Players */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-purple-300">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span>{players.length} Players Connected in Synchronous Session</span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {players.map(p => (
                      <div
                        key={p.id}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border shadow-sm ${
                          p.isUser
                            ? 'bg-yellow-400 text-purple-950 border-yellow-300 font-black scale-105'
                            : 'bg-purple-900/60 text-purple-100 border-purple-700/60'
                        }`}
                      >
                        <span className="text-base">{p.avatar}</span>
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={beginQuestion}
                    className="px-10 py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-purple-950 font-black text-base rounded-2xl shadow-xl shadow-yellow-500/30 transform hover:scale-105 transition flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-5 h-5 fill-purple-950" /> Start Live Countdown
                  </button>
                </div>
              </div>
            )}

            {/* PLAYING QUESTION STATE */}
            {gameState === 'playing' && currentQ && (
              <div className="space-y-6">
                {/* Header Stats */}
                <div className="flex items-center justify-between bg-[#1e0836] border border-purple-700/60 px-6 py-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-xs font-mono font-bold text-purple-300">
                      QUESTION <span className="text-yellow-400 text-base font-black">{currentQuestionIndex + 1}</span> / {activeQuiz.questions.length}
                    </div>
                    {streak > 1 && (
                      <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-xl text-xs font-bold animate-bounce">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" /> {streak}x Streak!
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 font-mono">
                    <div className="text-right">
                      <span className="text-[10px] text-purple-400 block">SCORE</span>
                      <span className="font-black text-yellow-400 text-lg">{score}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-950 border-2 border-yellow-400 flex items-center justify-center font-black text-xl text-yellow-300 shadow-inner">
                      {timeRemaining}
                    </div>
                  </div>
                </div>

                {/* Question Prompt Card */}
                <div className="bg-[#1e0836] border-2 border-purple-700 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-4">
                  <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                    {currentQ.points} PTS • {currentQ.type.toUpperCase()}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-relaxed">
                    {currentQ.question}
                  </h2>
                </div>

                {/* Chunky Game-Show Answer Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => submitAnswer(idx)}
                      className={`p-6 rounded-2xl font-black text-left flex items-center gap-4 text-base sm:text-lg transition transform active:scale-95 shadow-xl ${answerColors[idx % 4]}`}
                    >
                      <span className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center font-black text-lg">
                        {answerIcons[idx % 4]}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUESTION RESULT & LIVE LEADERBOARD */}
            {gameState === 'question-result' && currentQ && (
              <div className="bg-[#1e0836] border-2 border-purple-700/60 rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                  {isCorrect ? (
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 rounded-full font-black text-sm">
                      <CheckCircle2 className="w-5 h-5" /> CORRECT! +SPEED BONUS EARNED
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-rose-500/20 border-2 border-rose-400 text-rose-300 rounded-full font-black text-sm">
                      <XCircle className="w-5 h-5" /> INCORRECT!
                    </div>
                  )}

                  <h3 className="text-xl font-black text-white mt-2">
                    Correct Answer: <span className="text-yellow-400">{currentQ.options[currentQ.correctIndex]}</span>
                  </h3>
                </div>

                {/* Live Real-time Leaderboard */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-300 px-2">
                    <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-400" /> LIVE RANKINGS</span>
                    <span>POINTS</span>
                  </div>

                  <div className="space-y-2">
                    {players.map((p, idx) => (
                      <div
                        key={p.id}
                        className={`p-3.5 rounded-2xl flex items-center justify-between border transition ${
                          p.isUser
                            ? 'bg-yellow-400/20 border-yellow-400 text-white font-black'
                            : 'bg-purple-950/60 border-purple-800/80 text-purple-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                            idx === 0 ? 'bg-yellow-400 text-purple-950' : idx === 1 ? 'bg-slate-300 text-purple-950' : 'bg-amber-700 text-white'
                          }`}>
                            #{idx + 1}
                          </span>
                          <span className="text-lg">{p.avatar}</span>
                          <span className="text-sm font-bold">{p.name}</span>
                          {p.streak > 1 && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                              🔥 {p.streak}
                            </span>
                          )}
                        </div>

                        <span className="font-mono font-black text-yellow-400 text-base">{p.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <button
                    onClick={nextQuestion}
                    className="px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black rounded-2xl text-sm shadow-xl flex items-center gap-2 mx-auto transition"
                  >
                    <span>Next Phase</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PODIUM FINAL RESULTS */}
            {gameState === 'podium' && (
              <div className="bg-[#1e0836] border-2 border-yellow-400/60 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8">
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-yellow-500/40">
                    🏆
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-yellow-400">Match Concluded!</h2>
                  <p className="text-sm text-purple-300 font-mono">Final podium standings & points tallies</p>
                </div>

                {/* Top 3 Podium Cards */}
                <div className="grid grid-cols-3 gap-3 items-end pt-6">
                  {/* 2nd Place */}
                  {players[1] && (
                    <div className="bg-purple-950/80 border border-slate-400 p-4 rounded-2xl space-y-2 h-44 flex flex-col justify-end">
                      <span className="text-2xl">{players[1].avatar}</span>
                      <h4 className="font-bold text-xs truncate">{players[1].name}</h4>
                      <span className="font-mono font-black text-slate-300 text-sm">{players[1].score} pts</span>
                      <span className="px-2 py-0.5 bg-slate-300 text-purple-950 text-[10px] font-black rounded-lg">2ND PLACE</span>
                    </div>
                  )}

                  {/* 1st Place */}
                  {players[0] && (
                    <div className="bg-yellow-400/20 border-2 border-yellow-400 p-5 rounded-3xl space-y-2 h-56 flex flex-col justify-end shadow-xl shadow-yellow-500/20">
                      <span className="text-4xl animate-bounce">{players[0].avatar}</span>
                      <h4 className="font-black text-sm text-yellow-300 truncate">{players[0].name}</h4>
                      <span className="font-mono font-black text-yellow-400 text-lg">{players[0].score} pts</span>
                      <span className="px-3 py-1 bg-yellow-400 text-purple-950 text-xs font-black rounded-xl">👑 CHAMPION</span>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {players[2] && (
                    <div className="bg-purple-950/80 border border-amber-600 p-4 rounded-2xl space-y-2 h-36 flex flex-col justify-end">
                      <span className="text-2xl">{players[2].avatar}</span>
                      <h4 className="font-bold text-xs truncate">{players[2].name}</h4>
                      <span className="font-mono font-black text-amber-400 text-sm">{players[2].score} pts</span>
                      <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-black rounded-lg">3RD PLACE</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={() => startLiveGame(selectedQuizId)}
                    className="px-6 py-3 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 border border-purple-700"
                  >
                    <RotateCcw className="w-4 h-4" /> Rematch Arena
                  </button>
                  <button
                    onClick={() => setActiveTab('library')}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black rounded-2xl text-xs shadow-md"
                  >
                    Back to Library
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CREATOR STUDIO / QUIZ BUILDER */}
        {activeTab === 'builder' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-purple-800/60 pb-3">
              <h2 className="font-black text-2xl text-yellow-400">Creator Studio & Question Authoring</h2>
              <p className="text-xs text-purple-300 font-mono">Author multi-choice, true/false, and open-ended question sequences</p>
            </div>

            <form onSubmit={handleSaveQuiz} className="bg-[#1e0836] border border-purple-800/80 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-purple-300 font-bold">Arena / Quiz Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Advanced Distributed Consensus & Raft Protocols"
                    value={buildTitle}
                    onChange={e => setBuildTitle(e.target.value)}
                    className="w-full bg-[#2e0854] border border-purple-700 rounded-2xl p-3 text-white focus:outline-none focus:border-yellow-400 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-purple-300 font-bold">Domain Category</label>
                  <select
                    value={buildCategory}
                    onChange={e => setBuildCategory(e.target.value)}
                    className="w-full bg-[#2e0854] border border-purple-700 rounded-2xl p-3 text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="Science">Science & Quantum</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Pop Culture">Pop Culture & Gaming</option>
                    <option value="History">History & Geography</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-purple-300 font-bold">Difficulty Tier</label>
                  <select
                    value={buildDifficulty}
                    onChange={e => setBuildDifficulty(e.target.value)}
                    className="w-full bg-[#2e0854] border border-purple-700 rounded-2xl p-3 text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="Easy">Easy (Casual)</option>
                    <option value="Medium">Medium (Standard)</option>
                    <option value="Hard">Hard (Veteran)</option>
                    <option value="Expert">Expert (Championship)</option>
                  </select>
                </div>
              </div>

              {/* Questions Array */}
              <div className="space-y-6 pt-4 border-t border-purple-800/60">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-yellow-400 uppercase tracking-wider font-mono">
                    Questions Sequence ({buildQuestions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddQuestionToBuilder}
                    className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-yellow-300 border border-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {buildQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-[#2e0854] p-5 rounded-2xl border border-purple-700/60 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-yellow-400">QUESTION #{qIdx + 1}</span>
                      <div className="flex gap-2">
                        <select
                          value={q.timeLimit}
                          onChange={e => {
                            const newQs = [...buildQuestions];
                            newQs[qIdx].timeLimit = Number(e.target.value);
                            setBuildQuestions(newQs);
                          }}
                          className="bg-[#1e0836] border border-purple-600 rounded-lg px-2 py-1 text-purple-200 text-xs"
                        >
                          <option value="10">10 Secs</option>
                          <option value="15">15 Secs</option>
                          <option value="20">20 Secs</option>
                          <option value="30">30 Secs</option>
                        </select>
                      </div>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Type the question prompt..."
                      value={q.question}
                      onChange={e => {
                        const newQs = [...buildQuestions];
                        newQs[qIdx].question = e.target.value;
                        setBuildQuestions(newQs);
                      }}
                      className="w-full bg-[#1e0836] border border-purple-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-yellow-400"
                    />

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctIndex === oIdx}
                            onChange={() => {
                              const newQs = [...buildQuestions];
                              newQs[qIdx].correctIndex = oIdx;
                              setBuildQuestions(newQs);
                            }}
                            className="accent-yellow-400 cursor-pointer"
                            title="Mark as correct answer"
                          />
                          <input
                            type="text"
                            required
                            placeholder={`Option ${oIdx + 1}`}
                            value={opt}
                            onChange={e => {
                              const newQs = [...buildQuestions];
                              newQs[qIdx].options[oIdx] = e.target.value;
                              setBuildQuestions(newQs);
                            }}
                            className="flex-1 bg-[#1e0836] border border-purple-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black rounded-2xl text-xs shadow-xl transition"
                >
                  Publish & Deploy Arena
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-purple-800/60 pb-3">
              <h2 className="font-black text-2xl text-yellow-400">Quiz Analytics & Creator Telemetry</h2>
              <p className="text-xs text-purple-300 font-mono">Response distributions, dropout points, and question difficulty indexes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1e0836] p-5 rounded-2xl border border-purple-700/60 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase">Total Arena Plays</span>
                <div className="text-3xl font-black text-yellow-400">5,720</div>
                <span className="text-[11px] text-emerald-400 font-mono">↑ 24% this week</span>
              </div>
              <div className="bg-[#1e0836] p-5 rounded-2xl border border-purple-700/60 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase">Average Match Accuracy</span>
                <div className="text-3xl font-black text-emerald-400">76.4%</div>
                <span className="text-[11px] text-purple-300 font-mono">Across 18,290 responses</span>
              </div>
              <div className="bg-[#1e0836] p-5 rounded-2xl border border-purple-700/60 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase">Top Hardest Question</span>
                <div className="text-sm font-bold text-rose-300 truncate">Raft Asymmetric Network Splits</div>
                <span className="text-[11px] text-rose-400 font-mono">31% Pass rate</span>
              </div>
            </div>

            <div className="bg-[#1e0836] border border-purple-700/60 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-black text-sm text-yellow-400 font-mono uppercase">Per-Question Completion Breakdown</h3>
              <div className="space-y-3">
                {[
                  { q: 'Gravitational redshift escaping black hole well', accuracy: 82, time: '8.4s' },
                  { q: 'Hawking radiation mass loss and evaporation', accuracy: 91, time: '5.1s' },
                  { q: 'Schwarzschild event horizon point of no return', accuracy: 68, time: '11.2s' },
                  { q: '5-node Raft quorum commit threshold', accuracy: 44, time: '13.8s' }
                ].map((item, i) => (
                  <div key={i} className="bg-[#2e0854]/60 p-4 rounded-2xl border border-purple-800/40 space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center text-white">
                      <span className="font-bold">{item.q}</span>
                      <span className="text-purple-300">{item.time} avg time</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-purple-950 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" style={{ width: `${item.accuracy}%` }}></div>
                      </div>
                      <span className="text-yellow-300 font-bold w-10 text-right">{item.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-800/60 bg-[#1e0836] py-5 px-4 text-center text-xs font-mono text-purple-400">
        QUIZVORTEX • REAL-TIME SYNCHRONOUS GAME ARENA • MULTIPLAYER SCORING ENGINE
      </footer>
    </div>
  );
}
