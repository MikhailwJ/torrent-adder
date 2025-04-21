import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { Navbar, Tab, Tabs } from '@extension/ui';
import type { FileRouteTypes } from '@src/routeTree.gen';
import { useLocation, useRouter, type ReactNode } from '@tanstack/react-router';
import { clsx } from 'clsx';

const Options = ({ children }: ReactNode) => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  const router = useRouter();
  const location = useLocation();
  const isBasePath = router.basepath === location.pathname;

  // const logo = isLight ? 'options/logo_horizontal.svg' : 'options/logo_horizontal_dark.svg';
  // const goGithubSite = () =>
  //   chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

  const tabs: { title: string; path: FileRouteTypes['to'] }[] = [
    { title: 'WebUI', path: '/' },
    { title: 'Notifications', path: '/notifications' },
    { title: 'Link Catching', path: '/link-catching' },
    { title: 'Import/Export Settings', path: '/settings' },
    { title: 'About/Support', path: '/about' },
  ];

  return (
    <div className={`App ${isLight ? 'bg-slate-50 text-gray-900' : 'bg-gray-800 text-gray-100'} h-dvh flex flex-col`}>
      <Navbar className="p-4">
        <h1 className="flex items-center text-2xl font-semibold">
          <img src="BitTorrent48.png" alt="BitTorrent!" className="mr-2" /> Remote Torrent Adder Options
        </h1>
      </Navbar>
      <div className="bg-base-300 border-0 flex flex-col h-full">
        <Tabs className="border-base-100 px-4" variant="lift">
          {tabs.map(({ title, path }, i) => (
            <Tab
              to={path}
              className={clsx({ 'tab-active active': isBasePath && !i })}
              activeProps={{ className: 'tab-active' }}
              key={path}>
              {title}
            </Tab>
          ))}
        </Tabs>
        <div className="p-6 bg-base-100 h-full">{children}</div>
      </div>
      {/* <button onClick={goGithubSite}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
      </button>
      <p>
        Edit <code>pages/options/src/Options.tsx</code>
      </p>
      <ToggleButton onClick={exampleThemeStorage.toggle}>{t('toggleTheme')}</ToggleButton> */}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
