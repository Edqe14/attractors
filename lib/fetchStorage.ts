import isStorageSupported from './isStorageSupported';

const fetchStorage = (key: string, defaultValue: string): string => {
  if (!isStorageSupported()) throw new Error('LocalStorage is not supported');

  const data = window.localStorage.getItem(key);

  if (!data) {
    window.localStorage.setItem(key, defaultValue);

    return defaultValue;
  }

  return data;
};

export default fetchStorage;