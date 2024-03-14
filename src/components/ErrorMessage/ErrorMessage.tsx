import { useAppSelector } from '../../app/hooks.ts';

export const ErrorMessage: React.FC = () => {
  const errorText = useAppSelector((state) => state.todos.hasError);
  return (
    <div className="title has-text-centered">
      <h2 className="has-text-danger">{errorText}</h2>
    </div>
  );
};
