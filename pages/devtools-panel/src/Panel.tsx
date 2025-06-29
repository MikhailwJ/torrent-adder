import { t } from '@extension/i18n';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { ErrorDisplay } from '@extension/ui';
import '@src/Panel.css';
import type { ComponentPropsWithoutRef } from 'react';

const Panel = () => {
  const { isLight } = useStorage(themeStorage);

  const logo = isLight ? 'devtools-panel/logo_horizontal.svg' : 'devtools-panel/logo_horizontal_dark.svg';
  const goGithubSite = () =>
    chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <button onClick={goGithubSite}>
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        </button>
        <p>
          Edit <code>pages/devtools-panel/src/Panel.tsx</code>
        </p>
        <ToggleButton onClick={themeStorage.toggle}>{t('toggleTheme')}</ToggleButton>
      </header>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const { isLight } = useStorage(themeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'mt-4 rounded px-4 py-1 font-bold shadow hover:scale-105' +
        (isLight ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={themeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), ErrorDisplay);
