import { useEffect } from 'react';

/**
 * @param key - the name of the key to respond to, compared against event.key
 * @param callback - the callback to perform on key press
 */
const useKeypress = (key: string, callback: () => void): void => {
  useEffect(() => {
    const onKeyup = (e: KeyboardEvent) => {
      if (e.key === key) callback();
    };

    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, []);
};

export default useKeypress;
