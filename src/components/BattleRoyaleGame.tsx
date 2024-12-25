import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GameScene } from './game/GameScene';

const BattleRoyaleGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameSceneRef = useRef<GameScene | null>(null);
  const navigate = useNavigate();
  const [playersAlive, setPlayersAlive] = useState<number>(100);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize game scene
    gameSceneRef.current = new GameScene(containerRef.current);
    gameSceneRef.current.animate();

    // Example: Listen to game updates for players alive
    const updatePlayersAlive = (remainingPlayers: number) => {
      setPlayersAlive(remainingPlayers);
    };

    gameSceneRef.current.on('updatePlayersAlive', updatePlayersAlive);

    // Cleanup
    return () => {
      if (gameSceneRef.current) {
        gameSceneRef.current.off('updatePlayersAlive', updatePlayersAlive);
        gameSceneRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-screen" />
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={() => navigate('/')}
          className="bg-game-primary hover:bg-game-primary/80"
        >
          Retour au menu
        </Button>
      </div>
      <div className="absolute top-4 right-4 z-10 bg-gray-900/80 p-4 rounded-lg">
        <p className="text-game-primary font-rajdhani text-2xl">
          Joueurs restants: {playersAlive}
        </p>
      </div>
      <div className="absolute bottom-4 left-4 z-10 bg-gray-900/80 p-4 rounded-lg">
        <p className="text-white font-rajdhani">
          Utilisez ZQSD/WASD pour vous déplacer
        </p>
      </div>
    </div>
  );
};

export default BattleRoyaleGame;