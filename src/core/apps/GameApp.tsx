import React from 'react';
import { DistroConfig, DistroId } from '../../types/distro';
import { UbuntuJellyfishGame } from './games/UbuntuJellyfishGame';
import { MintSnakeGame } from './games/MintSnakeGame';
import { KubuntuPlasmaGame } from './games/KubuntuPlasmaGame';
import { KaliBreachGame } from './games/KaliBreachGame';
import { Zorin2048Game } from './games/Zorin2048Game';
import { ElementaryMemoryGame } from './games/ElementaryMemoryGame';
import { ArchTyperGame } from './games/ArchTyperGame';

export const DISTRO_GAME_META: Record<DistroId, { title: string; desc: string }> = {
  ubuntu: { title: 'Jellyfish Dash', desc: 'Arcade tangkap orb ala Ubuntu Jellyfish' },
  mint: { title: 'Mint Leaf Snake', desc: 'Game ular klasik hijau ala Linux Mint' },
  kubuntu: { title: 'Plasma Circuit', desc: 'Puzzle sirkuit cahaya KDE Plasma' },
  kali: { title: 'Cyber Breach', desc: 'Retas 4-digit PIN firewall ala Kali' },
  zorin: { title: 'Zorin Tiles 2048', desc: 'Puzzle 2048 modern ala Zorin OS' },
  elementary: { title: 'Pantheon Zen Memory', desc: 'Memory card minimalis ala elementary OS' },
  arch: { title: 'Pacman Speed Typer', desc: 'Tantangan ketik perintah Arch Linux' },
};

export const GameApp: React.FC<{ distro: DistroConfig }> = ({ distro }) => {
  switch (distro.id) {
    case 'ubuntu':
      return <UbuntuJellyfishGame />;
    case 'mint':
      return <MintSnakeGame />;
    case 'kubuntu':
      return <KubuntuPlasmaGame />;
    case 'kali':
      return <KaliBreachGame />;
    case 'zorin':
      return <Zorin2048Game />;
    case 'elementary':
      return <ElementaryMemoryGame />;
    case 'arch':
      return <ArchTyperGame />;
  }
};
