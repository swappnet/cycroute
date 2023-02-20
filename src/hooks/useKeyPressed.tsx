import { useState, useEffect } from 'react';

const useKeyPressed = () => {
  const [keyPressed, setKeyPressed] = useState<{
    key: string;
    code: string | undefined;
  }>({
    key: '',
    code: undefined,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputField = e.target instanceof HTMLInputElement;
      if (!isInputField) {
        setKeyPressed({ key: e.key, code: e.code });
      }
    };

    const handleKeyUp = () => {
      setKeyPressed({ key: '', code: undefined });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keyPressed;
};

export default useKeyPressed;
