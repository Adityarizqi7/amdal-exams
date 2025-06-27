import { useEffect, useRef } from "react";

const useDebouncedCallback = (callback, delay = 2000) => {
  const timeout = useRef();

  const debounced = (...args) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    return () => clearTimeout(timeout.current); // cleanup on unmount
  }, []);

  return debounced;
};

export default useDebouncedCallback;
