import EditorPage from './pages/EditorPage';
import Start from './pages/Start';
import { useAppSelector } from './hooks/redux-hooks';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import ScrollToTop from './hooks/ScrollToTop';

function App() {
  const darkMode = useAppSelector((state) => state.controlsReducer.darkMode);

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
