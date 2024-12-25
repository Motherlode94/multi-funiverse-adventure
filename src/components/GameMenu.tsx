import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Composant pour chaque mode de jeu
const GameModeCard = ({ id, title, description, available, navigate }) => (
  <div
    className={`p-6 rounded-lg border-2 ${
      available
        ? 'border-game-primary bg-gray-800/50 hover:bg-gray-800/80'
        : 'border-gray-700 bg-gray-800/30 opacity-50'
    } transition-all duration-300`}
  >
    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-400 mb-4">{description}</p>
    <Button
      onClick={() => available && navigate(`/game/${id}`)}
      disabled={!available}
      aria-disabled={!available}
      className={`w-full ${
        available
          ? 'bg-game-primary hover:bg-game-primary/80'
          : 'bg-gray-700'
      }`}
    >
      {available ? 'Jouer' : 'Bientôt disponible'}
    </Button>
  </div>
);

const GameMenu = () => {
  const navigate = useNavigate();
  const gameModesConfig = [
    {
      id: 'survival',
      title: 'Mode Survie',
      description: "Survivez aux vagues d'ennemis",
      available: true,
    },
    {
      id: 'battle-royale',
      title: 'Battle Royale',
      description: 'Soyez le dernier survivant',
      available: true, // Maintenant disponible
    },
    {
      id: 'team-deathmatch',
      title: 'Team Deathmatch',
      description: 'Combat en équipe',
      available: false,
    },
    {
      id: 'race',
      title: 'Course',
      description: 'Mode course classique et duel',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-rajdhani">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-6xl font-bold text-center mb-12 text-game-primary animate-pulse-glow">
          Multi Game Arena
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {gameModesConfig.map((mode) => (
            <GameModeCard key={mode.id} {...mode} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameMenu;