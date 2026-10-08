import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { achievements } from '../data/achievements';
import { LEVELS } from '../data/locations';
import { DEFAULT_AVATAR } from '../data/avatars';

const repairProgressionState = (state) => {
  if (!state) return state;
  let completed = Array.isArray(state.completedLocations) ? [...state.completedLocations] : [];
  let unlocked = Array.isArray(state.unlockedLocations) ? [...state.unlockedLocations] : ['tech-district'];

  if (!unlocked.includes('tech-district')) {
    unlocked.push('tech-district');
  }

  // Repair progression based on completed levels
  for (let i = 0; i < LEVELS.length - 1; i++) {
    const currentId = LEVELS[i].id;
    const nextId = LEVELS[i + 1].id;
    if (completed.includes(currentId) && !unlocked.includes(nextId)) {
      unlocked.push(nextId);
    }
  }

  const finalCompleted = Array.from(new Set(completed));
  const finalUnlocked = Array.from(new Set(unlocked));

  let modified = { ...state };
  if (!modified.avatar || !modified.avatar.headgearId) {
    modified.avatar = DEFAULT_AVATAR;
  }

  if (
    finalCompleted.length !== (state.completedLocations || []).length ||
    finalUnlocked.length !== (state.unlockedLocations || []).length ||
    !state.avatar
  ) {
    return {
      ...modified,
      completedLocations: finalCompleted,
      unlockedLocations: finalUnlocked,
    };
  }

  return modified;
};

const INITIAL_STATE = {
  playerName: '',
  studentGrade: '3rd', // '1st' | '2nd' | '3rd' | '4th' | '5th' standard
  guideEnabled: true,
  avatar: DEFAULT_AVATAR,
  score: 0,
  ecoImpact: 0,
  resourceRecovery: 0,
  cityRisk: 50,
  timeRemaining: 900, // 15 minutes
  completedLocations: [],
  inspectedDevices: [],
  decisions: [],
  achievements: [],
  clues: [],
  unlockedLocations: ['tech-district'],
  gameCompleted: false,
  gameStarted: false,
  emergencyMode: false,
  completedPuzzles: [],
  recyclingScore: 0,
  hazardsFound: 0,
  easterEggs: [],
  devicesRepaired: 0,
  devicesRecycled: 0,
  devicesDonated: 0,
  badDecisions: 0,
  presentationMode: false,
};

export function useGameState() {
  const [gameState, setGameState] = useLocalStorage('ewaste-game-state', INITIAL_STATE);
  const [newAchievements, setNewAchievements] = useState([]);

  // Self-healing progression migration on load
  useEffect(() => {
    setGameState(prev => repairProgressionState(prev));
  }, [setGameState]);

  // Check and unlock achievements
  const checkAchievements = useCallback((state) => {
    const unlocked = [];
    achievements.forEach(achievement => {
      if (!state.achievements.includes(achievement.id)) {
        try {
          if (achievement.condition(state)) {
            unlocked.push(achievement);
          }
        } catch (e) {
          // Silently ignore condition errors
        }
      }
    });
    return unlocked;
  }, []);

  const updateState = useCallback((updates) => {
    setGameState(prev => {
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      
      // Check achievements
      const newlyUnlocked = checkAchievements(next);
      if (newlyUnlocked.length > 0) {
        const achievementIds = newlyUnlocked.map(a => a.id);
        next.achievements = [...(next.achievements || []), ...achievementIds];
        setNewAchievements(newlyUnlocked);
        setTimeout(() => setNewAchievements([]), 5000);
      }
      
      return next;
    });
  }, [setGameState, checkAchievements]);

  const addScore = useCallback((points) => {
    updateState(prev => ({ ...prev, score: prev.score + points }));
  }, [updateState]);

  const updateEcoMetrics = useCallback((ecoImpact, resourceRecovery, cityRisk) => {
    updateState(prev => ({
      ...prev,
      ecoImpact: Math.max(-100, Math.min(100, prev.ecoImpact + ecoImpact)),
      resourceRecovery: Math.max(-100, Math.min(100, prev.resourceRecovery + resourceRecovery)),
      cityRisk: Math.max(0, Math.min(100, prev.cityRisk + cityRisk)),
    }));
  }, [updateState]);

  const recordDecision = useCallback((deviceId, choice, correct, score, ecoImpact, resourceRecovery, cityRisk) => {
    updateState(prev => {
      const newDecision = { deviceId, choice, correct, score, timestamp: Date.now() };
      return {
        ...prev,
        decisions: [...prev.decisions, newDecision],
        score: prev.score + score,
        ecoImpact: Math.max(-100, Math.min(100, prev.ecoImpact + ecoImpact)),
        resourceRecovery: Math.max(-100, Math.min(100, prev.resourceRecovery + resourceRecovery)),
        cityRisk: Math.max(0, Math.min(100, prev.cityRisk + cityRisk)),
        badDecisions: correct ? prev.badDecisions : prev.badDecisions + 1,
        devicesRecycled: choice === 'recycle' ? prev.devicesRecycled + 1 : prev.devicesRecycled,
        devicesRepaired: choice === 'repair' ? prev.devicesRepaired + 1 : prev.devicesRepaired,
        devicesDonated: choice === 'reuse' ? prev.devicesDonated + 1 : prev.devicesDonated,
      };
    });
  }, [updateState]);

  const markDeviceInspected = useCallback((deviceId) => {
    updateState(prev => {
      if (prev.inspectedDevices.includes(deviceId)) return prev;
      return { ...prev, inspectedDevices: [...prev.inspectedDevices, deviceId] };
    });
  }, [updateState]);

  const completeLocation = useCallback((locationId) => {
    updateState(prev => {
      const completedLocations = prev.completedLocations.includes(locationId)
        ? prev.completedLocations
        : [...prev.completedLocations, locationId];

      const currentLevelIndex = LEVELS.findIndex(l => l.id === locationId);
      let unlockedLocations = prev.unlockedLocations ? [...prev.unlockedLocations] : ['tech-district'];

      if (currentLevelIndex !== -1 && currentLevelIndex + 1 < LEVELS.length) {
        const nextLevelId = LEVELS[currentLevelIndex + 1].id;
        if (!unlockedLocations.includes(nextLevelId)) {
          unlockedLocations.push(nextLevelId);
        }
      }

      // Ensure chain of unlocks
      for (let i = 0; i < LEVELS.length - 1; i++) {
        const curId = LEVELS[i].id;
        const nxtId = LEVELS[i + 1].id;
        if (completedLocations.includes(curId) && !unlockedLocations.includes(nxtId)) {
          unlockedLocations.push(nxtId);
        }
      }

      const finalCompleted = Array.from(new Set(completedLocations));
      const finalUnlocked = Array.from(new Set(unlockedLocations));

      console.log('GAME PROGRESSION', {
        completedLevels: finalCompleted,
        unlockedLevels: finalUnlocked
      });

      return {
        ...prev,
        completedLocations: finalCompleted,
        unlockedLocations: finalUnlocked,
      };
    });
  }, [updateState]);

  const unlockLocation = useCallback((locationId) => {
    updateState(prev => {
      if (prev.unlockedLocations.includes(locationId)) return prev;
      return { ...prev, unlockedLocations: [...prev.unlockedLocations, locationId] };
    });
  }, [updateState]);

  const completePuzzle = useCallback((puzzleId) => {
    updateState(prev => {
      if (prev.completedPuzzles.includes(puzzleId)) return prev;
      return { ...prev, completedPuzzles: [...prev.completedPuzzles, puzzleId] };
    });
  }, [updateState]);

  const addEasterEgg = useCallback((eggId) => {
    updateState(prev => {
      if (prev.easterEggs.includes(eggId)) return prev;
      return { ...prev, easterEggs: [...prev.easterEggs, eggId], score: prev.score + 75 };
    });
  }, [updateState]);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
    setNewAchievements([]);
  }, [setGameState]);

  const startGame = useCallback((playerName, studentGrade = '3rd') => {
    updateState(prev => ({
      ...prev,
      playerName,
      studentGrade,
      gameStarted: true,
      timeRemaining: 900,
    }));
  }, [updateState]);

  const completeGame = useCallback(() => {
    updateState(prev => ({ ...prev, gameCompleted: true }));
  }, [updateState]);

  const getRank = useCallback((score) => {
    if (score >= 1200) return { rank: 'NOVA CITY E-WASTE HERO', color: '#f59e0b', icon: '🏆' };
    if (score >= 900) return { rank: 'CIRCULAR ECONOMY CHAMPION', color: '#00d68f', icon: '🌿' };
    if (score >= 650) return { rank: 'ECO INVESTIGATOR', color: '#00b4d8', icon: '🔍' };
    if (score >= 400) return { rank: 'RESOURCE SAVER', color: '#8b5cf6', icon: '♻️' };
    return { rank: 'E-WASTE ROOKIE', color: '#8b9ab8', icon: '🎖️' };
  }, []);

  const updateAvatar = useCallback((avatarData) => {
    updateState(prev => ({
      ...prev,
      avatar: { ...(prev.avatar || DEFAULT_AVATAR), ...avatarData },
    }));
  }, [updateState]);

  return {
    gameState,
    newAchievements,
    updateState,
    updateAvatar,
    addScore,
    updateEcoMetrics,
    recordDecision,
    markDeviceInspected,
    completeLocation,
    completeLevel: completeLocation,
    unlockLocation,
    completePuzzle,
    addEasterEgg,
    resetGame,
    startGame,
    completeGame,
    getRank,
  };
}
