const isStorageSupported = () => {
  const val = 'attr';
  try {
    localStorage.setItem(val, val);
    localStorage.removeItem(val);

    return true;
  } catch (e) {
    return false;
  }
};

export default isStorageSupported;