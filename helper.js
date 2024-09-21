function formatDateToFrontend(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();

  // Tarihleri aynı gün saatinde sıfırlamak için
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  // Gün farkını hesapla
  const diffTime = today - inputDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
export default formatDateToFrontend;

export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const getStorage = (key) => {
  const store = JSON.parse(localStorage.getItem(key));
  return store;
};

export const removeStorage = (key) => {
  localStorage.removeItem(key);
};
