export const debounce = (func: (...args: any[]) => void, time: number) => {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func(...args);
    }, time);
  };
};