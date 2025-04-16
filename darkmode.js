// Funkcja inicjalizująca tryb na podstawie lokalnych ustawień
function initializeDarkMode() {
    // Sprawdź, czy w localStorage zapisano tryb
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
  
    // Jeśli tryb ciemny jest włączony, dodaj klasę darkmode do body
    if (darkMode) {
      document.body.classList.add('darkmode');
    }
  }
  
  // Funkcja przełączająca tryb
  function toggleDarkMode() {
    // Sprawdź, czy tryb ciemny jest aktywny
    const isDarkMode = document.body.classList.contains('darkmode');
  
    // Jeśli jest aktywny, wyłącz go, w przeciwnym razie włącz
    if (isDarkMode) {
      document.body.classList.remove('darkmode');
      localStorage.setItem('darkMode', 'disabled');
    } else {
      document.body.classList.add('darkmode');
      localStorage.setItem('darkMode', 'enabled');
    }
  }
  
