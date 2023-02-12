import Home from './pages/Home';
import { useState } from 'react';
import Start from './pages/Start';
import { useAppSelector } from './hooks/redux-hooks';

function App() {
  const [isNewRoute, setIsNewRoute] = useState<boolean>(false);
  const darkMode = useAppSelector((state) => state.controlsReducer.darkMode);

  return (
    <div className={`App theme-${darkMode}`}>
      {!isNewRoute && (
        <Start newRoute={() => setIsNewRoute((isNewRoute) => !isNewRoute)} />
      )}
      {isNewRoute && <Home />}
    </div>
  );
}

export default App;
