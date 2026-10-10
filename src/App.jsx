import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';
import Navbar from './components/Navbar';
import GameHUD from './components/GameHUD';
import AchievementToast from './components/AchievementToast';
import LoadingScreen from './components/LoadingScreen';
import AvatarSelect from './pages/AvatarSelect';
import Home from './pages/Home';
import Briefing from './pages/Briefing';
import CityMap from './pages/CityMap';
import TechDistrict from './pages/TechDistrict';
import ResidentialBlock from './pages/ResidentialBlock';
import RepairLab from './pages/RepairLab';
import ScrapYard from './pages/ScrapYard';
import RecyclingCenter from './pages/RecyclingCenter';
import FinalMystery from './pages/FinalMystery';
import Results from './pages/Results';
import Learn from './pages/Learn';
import ImpactDashboard from './pages/ImpactDashboard';
import AchievementsPage from './pages/AchievementsPage';
import Leaderboard from './pages/Leaderboard';
import { LEVELS } from './data/locations';
import UnlockModal from './components/UnlockModal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ChibiGuideBot from './components/ChibiGuideBot';

export default function App() {
  const [currentPage, setCurrentPage] = useState('loading');
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    gameState,
    newAchievements,
    updateState,
    updateAvatar,
    recordDecision,
    markDeviceInspected,
    completeLocation,
    unlockLocation,
    completePuzzle,
    addEasterEgg,
    resetGame,
    startGame,
    completeGame,
    getRank,
  } = useGameState();

  const timer = useTimer(gameState.timeRemaining || 900, () => {
    updateState(prev => ({ ...prev, emergencyMode: true }));
  });

  // Sync timer with persisted state
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameCompleted) {
      timer.setTime(gameState.timeRemaining || 900);
    }
  }, []);

  // Persist timer every 5 seconds
  useEffect(() => {
    if (timer.isRunning) {
      const interval = setInterval(() => {
        updateState(prev => ({ ...prev, timeRemaining: timer.timeRemaining }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [timer.isRunning, timer.timeRemaining]);

  // Loading screen & routing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryPage = urlParams.get('page');
    if (queryPage) {
      setIsLoaded(true);
      setCurrentPage(queryPage);
      return;
    }

    const timeout = setTimeout(() => {
      setIsLoaded(true);
      if (gameState.gameStarted && !gameState.gameCompleted) {
        setCurrentPage('map');
      } else if (gameState.gameCompleted) {
        setCurrentPage('results');
      } else {
        setCurrentPage('home');
      }
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  const navigate = (page) => {
    let target = page;
    if (page === '/admin') target = 'admin';
    if (page === '/admin/dashboard') target = 'admin_dashboard';
    setCurrentPage(target);
    window.scrollTo(0, 0);
  };

  const handleStartMission = (name, grade) => {
    startGame(name, grade);
    navigate('avatar_select');
  };

  const handleAcceptMission = () => {
    timer.start();
    navigate('map');
  };

  const [unlockedModalLevel, setUnlockedModalLevel] = useState(null);

  const handleLocationSelect = (locationId) => {
    if (!gameState.unlockedLocations.includes(locationId)) return;
    navigate(locationId.replace('-', '_'));
  };

  const handleLocationComplete = (locationId, nextLocationId, bonusScore) => {
    completeLocation(locationId);

    if (bonusScore) {
      updateState(prev => ({ ...prev, score: prev.score + bonusScore }));
    }

    const allLocationIds = LEVELS.map(l => l.id);
    const completedAfter = gameState.completedLocations.includes(locationId)
      ? gameState.completedLocations
      : [...gameState.completedLocations, locationId];

    if (allLocationIds.every(l => completedAfter.includes(l))) {
      navigate('final-mystery');
    } else {
      if (nextLocationId) {
        const nextLevelObj = LEVELS.find(l => l.id === nextLocationId);
        if (nextLevelObj) {
          setUnlockedModalLevel(nextLevelObj);
        }
      }
      navigate('map');
    }
  };

  const handleResetGame = () => {
    timer.pause();
    timer.reset();
    resetGame();
    navigate('home');
  };

  const handleCompleteGame = () => {
    timer.pause();
    updateState(prev => ({ ...prev, timeRemaining: timer.timeRemaining }));
    completeGame();
    navigate('results');
  };

  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return window.localStorage.getItem('ewaste-admin-auth') === 'true';
  });

  const inMission = gameState.gameStarted && !gameState.gameCompleted &&
    !['home', 'avatar_select', 'briefing', 'results', 'learn', 'achievements', 'impact', 'leaderboard', 'loading', 'admin', 'admin_dashboard'].includes(currentPage);

  if (currentPage === 'loading') {
    return <LoadingScreen />;
  }

  const pageTitleMap = {
    home: 'Home',
    avatar_select: 'Wardrobe & Avatar Studio',
    briefing: 'Mission Briefing',
    map: 'City Map',
    tech_district: 'Tech District',
    residential_block: 'Residential Block',
    repair_lab: 'Repair Lab',
    scrap_yard: 'Scrap Yard',
    recycling_center: 'Recycling Center',
    'final-mystery': 'Final Mystery',
    results: 'Impact Report',
    learn: 'Learn',
    achievements: 'Achievements',
    impact: 'Impact Dashboard',
    leaderboard: 'Leaderboard',
  };

  return (
    <div className="app" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar
        currentPage={currentPage}
        navigate={navigate}
        gameState={gameState}
        inMission={inMission}
        onReset={handleResetGame}
        presentationMode={gameState.presentationMode}
        onTogglePresentation={() => updateState(prev => ({ ...prev, presentationMode: !prev.presentationMode }))}
      />

      {inMission && !gameState.presentationMode && (
        <GameHUD
          gameState={gameState}
          timer={timer}
          emergencyMode={gameState.emergencyMode}
        />
      )}

      <main style={{ paddingTop: inMission ? '8rem' : '4rem' }}>
        {currentPage === 'home' && (
          <Home
            onStart={handleStartMission}
            gameState={gameState}
            navigate={navigate}
            updateState={updateState}
          />
        )}
        {currentPage === 'avatar_select' && (
          <AvatarSelect
            gameState={gameState}
            updateAvatar={updateAvatar}
            onProceed={(name, avatar) => {
              if (name) updateState(prev => ({ ...prev, playerName: name }));
              if (avatar) updateAvatar(avatar);
              navigate('briefing');
            }}
            navigate={navigate}
          />
        )}
        {currentPage === 'briefing' && (
          <Briefing onAccept={handleAcceptMission} playerName={gameState.playerName} gameState={gameState} />
        )}
        {currentPage === 'map' && (
          <CityMap
            gameState={gameState}
            onLocationSelect={handleLocationSelect}
            navigate={navigate}
            timer={timer}
          />
        )}
        {currentPage === 'tech_district' && (
          <TechDistrict
            gameState={gameState}
            recordDecision={recordDecision}
            markDeviceInspected={markDeviceInspected}
            completePuzzle={completePuzzle}
            onComplete={() => handleLocationComplete('tech-district', 'residential-block', 150)}
            navigate={navigate}
            addEasterEgg={addEasterEgg}
          />
        )}
        {currentPage === 'residential_block' && (
          <ResidentialBlock
            gameState={gameState}
            recordDecision={recordDecision}
            completePuzzle={completePuzzle}
            onComplete={() => handleLocationComplete('residential-block', 'repair-lab', 120)}
            navigate={navigate}
          />
        )}
        {currentPage === 'repair_lab' && (
          <RepairLab
            gameState={gameState}
            recordDecision={recordDecision}
            onComplete={() => handleLocationComplete('repair-lab', 'scrap-yard', 130)}
            navigate={navigate}
            updateState={updateState}
          />
        )}
        {currentPage === 'scrap_yard' && (
          <ScrapYard
            gameState={gameState}
            updateState={updateState}
            onComplete={() => handleLocationComplete('scrap-yard', 'recycling-center', 140)}
            navigate={navigate}
            completePuzzle={completePuzzle}
          />
        )}
        {currentPage === 'recycling_center' && (
          <RecyclingCenter
            gameState={gameState}
            updateState={updateState}
            onComplete={() => handleLocationComplete('recycling-center', null, 160)}
            navigate={navigate}
          />
        )}
        {currentPage === 'final-mystery' && (
          <FinalMystery
            gameState={gameState}
            updateState={updateState}
            onComplete={handleCompleteGame}
            navigate={navigate}
          />
        )}
        {currentPage === 'results' && (
          <Results
            gameState={gameState}
            getRank={getRank}
            timer={timer}
            navigate={navigate}
            onReset={handleResetGame}
          />
        )}
        {currentPage === 'learn' && (
          <Learn navigate={navigate} />
        )}
        {currentPage === 'achievements' && (
          <AchievementsPage gameState={gameState} navigate={navigate} />
        )}
        {currentPage === 'impact' && (
          <ImpactDashboard gameState={gameState} navigate={navigate} />
        )}
        {currentPage === 'leaderboard' && (
          <Leaderboard gameState={gameState} getRank={getRank} navigate={navigate} />
        )}
        {currentPage === 'admin' && (
          <AdminLogin
            onLoginSuccess={() => setIsAdminAuth(true)}
            navigate={navigate}
          />
        )}
        {currentPage === 'admin_dashboard' && (
          isAdminAuth ? (
            <AdminDashboard
              gameState={gameState}
              onLogout={() => setIsAdminAuth(false)}
              navigate={navigate}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={() => setIsAdminAuth(true)}
              navigate={navigate}
            />
          )
        )}
      </main>

      <AchievementToast achievements={newAchievements} />
      {unlockedModalLevel && (
        <UnlockModal
          level={unlockedModalLevel}
          onEnter={() => {
            const page = unlockedModalLevel.id.replace('-', '_');
            setUnlockedModalLevel(null);
            navigate(page);
          }}
          onClose={() => setUnlockedModalLevel(null)}
        />
      )}

      {currentPage !== 'loading' && currentPage !== 'home' && (
        <ChibiGuideBot
          currentPage={currentPage}
          gameState={gameState}
          updateState={updateState}
          navigate={navigate}
        />
      )}
    </div>
  );
}
