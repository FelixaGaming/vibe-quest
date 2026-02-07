
import React from 'react';
import { SpeakerType } from '../types';

interface AvatarProps {
  who: SpeakerType;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ who, size = 'md' }) => {
  const configs: Record<SpeakerType, { gradient: string; emoji: string; border: string }> = {
    sarah: { gradient: 'from-orange-400 to-orange-500', emoji: '👩', border: 'border-orange-500' },
    rex: { gradient: 'from-red-500 to-red-600', emoji: '🎮', border: 'border-red-600' },
    rob: { gradient: 'from-blue-400 to-blue-600', emoji: '👨', border: 'border-blue-600' },
    clau24: { gradient: 'from-indigo-400 to-indigo-600', emoji: '💭', border: 'border-indigo-600' },
    leo: { gradient: 'from-violet-400 to-violet-600', emoji: '🎯', border: 'border-violet-600' },
    mia: { gradient: 'from-pink-400 to-pink-600', emoji: '💀', border: 'border-pink-600' },
    tommy: { gradient: 'from-amber-400 to-amber-600', emoji: '🔥', border: 'border-amber-600' },
    luna: { gradient: 'from-cyan-400 to-cyan-600', emoji: '💥', border: 'border-cyan-600' },
    trollzor: { gradient: 'from-emerald-400 to-emerald-600', emoji: '😈', border: 'border-emerald-600' },
    you: { gradient: 'from-green-400 to-green-600', emoji: '⭐️', border: 'border-green-600' },
  };

  const config = configs[who] || configs.you;
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-14 h-14 text-2xl',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-gradient-to-br ${config.gradient} border-2 ${config.border} shadow-sm text-white font-bold overflow-hidden shrink-0`}>
      {config.emoji}
    </div>
  );
};

export default Avatar;
