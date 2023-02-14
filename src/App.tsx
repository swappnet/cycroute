import Home from './pages/Home';
import Start from './pages/Start';

import { useState } from 'react';

import { useAppSelector } from './hooks/redux-hooks';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';

function App() {
  const [isNewRoute, setIsNewRoute] = useState<boolean>(false);
  const darkMode = useAppSelector((state) => state.controlsReducer.darkMode);

  return (
    <div className={`App theme-${darkMode}`}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Start />}></Route>
          <Route path="/Editor" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
