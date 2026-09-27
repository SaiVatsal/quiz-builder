import { create } from 'zustand';

export const useStore = create((set, get) => ({
  activeTab: 'library', // 'library' | 'builder' | 'live-game' | 'analytics'
  selectedQuizId: 'QUIZ-01',

  // Game session state
  gameState: 'lobby', // 'lobby' | 'playing' | 'question-result' | 'podium'
  currentQuestionIndex: 0,
  timeRemaining: 15,
  score: 0,
  streak: 0,
  selectedAnswer: null,
  isCorrect: null,
  livePin: '849-204',

  players: [
    { id: 'p1', name: 'CosmoRider (You)', score: 3420, streak: 3, avatar: '🚀', isUser: true },
    { id: 'p2', name: 'ByteMaster', score: 3890, streak: 4, avatar: '⚡', isUser: false },
    { id: 'p3', name: 'NovaQueen', score: 3100, streak: 2, avatar: '👑', isUser: false },
    { id: 'p4', name: 'PixelSamurai', score: 2750, streak: 0, avatar: '⚔️', isUser: false },
    { id: 'p5', name: 'GlitchHacker', score: 2400, streak: 1, avatar: '🤖', isUser: false }
  ],

  quizzes: [
    {
      id: 'QUIZ-01',
      title: 'Cosmic Astrophysics & Quantum Paradoxes',
      category: 'Science',
      difficulty: 'Expert',
      cover: '🌌',
      author: 'Dr. Stella Vance',
      plays: 1420,
      avgScore: '74%',
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          question: 'What happens to the wavelength of light escaping a massive gravitational well?',
          options: [
            'Gravitational blueshift (wavelength shortens)',
            'Gravitational redshift (wavelength stretches)',
            'Total photon frequency annihilation',
            'Quantum spin reversal'
          ],
          correctIndex: 1,
          timeLimit: 15,
          points: 1000
        },
        {
          id: 'q2',
          type: 'tf',
          question: 'Hawking radiation implies black holes can eventually lose mass and evaporate.',
          options: ['True', 'False'],
          correctIndex: 0,
          timeLimit: 10,
          points: 800
        },
        {
          id: 'q3',
          type: 'mcq',
          question: 'Which boundary marks the point of no return around a Schwarzschild black hole?',
          options: [
            'Photon Sphere',
            'Ergosphere',
            'Event Horizon',
            'Accretion Disk Boundary'
          ],
          correctIndex: 2,
          timeLimit: 15,
          points: 1000
        }
      ]
    },
    {
      id: 'QUIZ-02',
      title: 'Distributed Consensus & Fault-Tolerant Raft',
      category: 'Computer Science',
      difficulty: 'Hard',
      cover: '🛡️',
      author: 'Karthik Rao',
      plays: 890,
      avgScore: '68%',
      questions: [
        {
          id: 'q2-1',
          type: 'mcq',
          question: 'What is the minimum quorum required to commit a log in a 5-node Raft cluster?',
          options: ['2 nodes', '3 nodes', '4 nodes', 'All 5 nodes'],
          correctIndex: 1,
          timeLimit: 15,
          points: 1000
        },
        {
          id: 'q2-2',
          type: 'tf',
          question: 'In Paxos and Raft, split votes during leader elections are resolved using randomized election timeouts.',
          options: ['True', 'False'],
          correctIndex: 0,
          timeLimit: 10,
          points: 800
        }
      ]
    },
    {
      id: 'QUIZ-03',
      title: 'Retro Gaming & 8-Bit Arcade Lore',
      category: 'Pop Culture',
      difficulty: 'Medium',
      cover: '🕹️',
      author: 'ArcadeLegend',
      plays: 3410,
      avgScore: '88%',
      questions: [
        {
          id: 'q3-1',
          type: 'mcq',
          question: 'Which classic game featured the legendary "Kill Screen" on Level 256?',
          options: ['Pac-Man', 'Space Invaders', 'Donkey Kong', 'Galaga'],
          correctIndex: 0,
          timeLimit: 15,
          points: 1000
        }
      ]
    }
  ],

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedQuizId: (id) => set({ selectedQuizId: id }),

  startLiveGame: (quizId) => {
    const quiz = get().quizzes.find(q => q.id === quizId) || get().quizzes[0];
    set({
      selectedQuizId: quiz.id,
      activeTab: 'live-game',
      gameState: 'lobby',
      currentQuestionIndex: 0,
      timeRemaining: quiz.questions[0]?.timeLimit || 15,
      score: 0,
      streak: 0,
      selectedAnswer: null,
      isCorrect: null
    });
  },

  beginQuestion: () => {
    const { quizzes, selectedQuizId, currentQuestionIndex } = get();
    const quiz = quizzes.find(q => q.id === selectedQuizId);
    const q = quiz?.questions[currentQuestionIndex];
    set({
      gameState: 'playing',
      timeRemaining: q?.timeLimit || 15,
      selectedAnswer: null,
      isCorrect: null
    });
  },

  submitAnswer: (index) => {
    const { quizzes, selectedQuizId, currentQuestionIndex, timeRemaining, streak, score, players } = get();
    const quiz = quizzes.find(q => q.id === selectedQuizId);
    const q = quiz?.questions[currentQuestionIndex];
    if (!q) return;

    const correct = index === q.correctIndex;
    const speedBonus = Math.floor((timeRemaining / q.timeLimit) * (q.points * 0.4));
    const earnedPoints = correct ? q.points + speedBonus + (streak * 100) : 0;
    const newScore = score + earnedPoints;
    const newStreak = correct ? streak + 1 : 0;

    // Simulate bot score additions
    const updatedPlayers = players.map(p => {
      if (p.isUser) {
        return { ...p, score: newScore, streak: newStreak };
      }
      const botCorrect = Math.random() > 0.25;
      const botGain = botCorrect ? Math.floor(q.points * 0.8 + Math.random() * 300) : 0;
      return {
        ...p,
        score: p.score + botGain,
        streak: botCorrect ? p.streak + 1 : 0
      };
    }).sort((a, b) => b.score - a.score);

    set({
      selectedAnswer: index,
      isCorrect: correct,
      gameState: 'question-result',
      score: newScore,
      streak: newStreak,
      players: updatedPlayers
    });
  },

  nextQuestion: () => {
    const { quizzes, selectedQuizId, currentQuestionIndex } = get();
    const quiz = quizzes.find(q => q.id === selectedQuizId);
    if (!quiz) return;

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      const nextQ = quiz.questions[currentQuestionIndex + 1];
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        gameState: 'playing',
        timeRemaining: nextQ.timeLimit,
        selectedAnswer: null,
        isCorrect: null
      });
    } else {
      set({ gameState: 'podium' });
    }
  },

  addQuiz: (newQuizData) => set((state) => ({
    quizzes: [
      {
        id: `QUIZ-0${state.quizzes.length + 1}`,
        plays: 0,
        avgScore: '100%',
        ...newQuizData
      },
      ...state.quizzes
    ],
    activeTab: 'library'
  }))
}));
