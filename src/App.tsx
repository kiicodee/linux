import React, { useEffect } from 'react';
import { useOSStore } from './store/useOSStore';
import { DISTRO_MAP } from './distros/registry';
import { DistroId } from './types/distro';
import { MarinerHome } from './home/MarinerHome';
import { DistroDesktop } from './shell/DistroDesktop';
import { BootSplash } from './core/BootSplash';
import { ToastContainer } from './core/ToastContainer';
import { useDocumentHead } from './core/useDocumentHead';

export const App: React.FC = () => {
  const { activeDistroId, bootingDistroId, launchDistro, returnHome } = useOSStore();

  // Deep link support via URL hash (e.g. /#ubuntu, /#mint, /#arch)
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase() as DistroId;
      if (hash && DISTRO_MAP[hash]) {
        launchDistro(hash, false);
      } else if (!hash && useOSStore.getState().activeDistroId) {
        returnHome();
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [launchDistro, returnHome]);

  const activeDistro = activeDistroId ? DISTRO_MAP[activeDistroId] : null;
  const bootingDistro = bootingDistroId ? DISTRO_MAP[bootingDistroId] : null;

  useDocumentHead(activeDistro, bootingDistro);

  return (
    <>
      {activeDistro ? <DistroDesktop distro={activeDistro} /> : <MarinerHome />}
      {bootingDistro && <BootSplash distro={bootingDistro} />}
      <ToastContainer />
    </>
  );
};

export default App;
