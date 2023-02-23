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
    // Checking if input is open or not, and if not open pass key to keyPressed state
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputField = e.target instanceof HTMLInputElement;
      if (!isInputField) {
        setKeyPressed({ key: e.key, code: e.code });
      }
    };

    // If key is up, reset keyPressed state
    const handleKeyUp = () => {
      setKeyPressed({ key: '', code: undefined });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      // Clear listeners
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keyPressed;
};

export default useKeyPressed;
