import React from 'react';
import { DistroConfig } from '../types/distro';
import { UbuntuShell } from './UbuntuShell';
import { MintShell } from './MintShell';
import { KubuntuShell } from './KubuntuShell';
import { KaliShell } from './KaliShell';
import { ZorinShell } from './ZorinShell';
import { ElementaryShell } from './ElementaryShell';
import { ArchShell } from './ArchShell';

interface ShellChromeProps {
  distro: DistroConfig;
}

export const ShellChrome: React.FC<ShellChromeProps> = ({ distro }) => {
  switch (distro.layout) {
    case 'top-left-dock':
      return <UbuntuShell distro={distro} />;
    case 'bottom-panel':
      return <MintShell distro={distro} />;
    case 'kde-plasma':
      return <KubuntuShell distro={distro} />;
    case 'top-xfce':
      return <KaliShell distro={distro} />;
    case 'start-menu':
      return <ZorinShell distro={distro} />;
    case 'macos-dock':
      return <ElementaryShell distro={distro} />;
    case 'tiling':
      return <ArchShell distro={distro} />;
  }
};
