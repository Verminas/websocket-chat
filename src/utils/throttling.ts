export const throttling = (func: (...args: any[]) => void, time: number) => {
  let isThrottled = false;

  return (...args: any[]) => {
    if (!isThrottled) {
      func(...args);
      isThrottled = true;

      setTimeout(() => {
        isThrottled = false;
      }, time);
    }
  };
};