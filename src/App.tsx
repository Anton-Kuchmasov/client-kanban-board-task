import { useAppSelector } from './app/hooks.ts';

import { Header } from './components/Header/Header.tsx';
import { Kanban } from './components/Kanban/Kanban.tsx';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage.tsx';

import { type RootState } from './app/store.ts';

import './App.css';

function App(): JSX.Element {
  const userID = useAppSelector((state: RootState) => state.user.id);
  const hasError = useAppSelector((state: RootState) => state.todos.hasError);

  return (
    <div className="container is-fluid vw-100">
      <div className="container mt-6">
        <Header />
        {!hasError && userID ? <Kanban /> : <ErrorMessage />}
      </div>
    </div>
  );
}

export default App;
