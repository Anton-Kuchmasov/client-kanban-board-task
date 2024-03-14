import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import App from './App.tsx';

import './index.css';

const rootElement = document.getElementById('root');

if (rootElement != null) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
