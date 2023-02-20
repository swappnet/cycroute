import EditorPage from './pages/EditorPage';
import Start from './pages/Start';
import { useAppSelector, useAppDispatch } from './hooks/redux-hooks';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import ScrollToTop from './hooks/ScrollToTop';

import { useEffect } from 'react';
import { switchDark } from './reducers/controlsReducer';

function App() {
  const darkMode = useAppSelector((state) => state.controlsReducer.darkMode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      dispatch(switchDark(storedTheme));
    }
  }, []);

  return (
    <div className={`App theme-${darkMode}`}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route index element={<Start />}></Route>
          <Route path="/Editor" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
