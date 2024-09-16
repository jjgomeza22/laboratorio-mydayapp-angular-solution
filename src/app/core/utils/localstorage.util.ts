export const setValueInLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export function getValueFromLocaStorage<T>(key: string, initialState: T): T  {
  const value = JSON.parse(localStorage.getItem(key)!);

  if (!value) {
    setValueInLocalStorage(key, JSON.stringify(initialState));
    return initialState;
  }
  return value;
};
