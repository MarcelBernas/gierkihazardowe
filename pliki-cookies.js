if (document.cookie.split("; ").find((row) => row.startsWith("username="))?.split("=")[1] === undefined) {
  document.cookie = "username=" + window.prompt('Witaj w strefie hazardu! Proszę podać nazwę użytkownika.') + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
}
if (document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1] === undefined) {
  document.cookie = "chips=1000; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
}
 
function updateUserInfo() {
  const username = document.cookie.split("; ").find((row) => row.startsWith("username="))?.split("=")[1];
  document.getElementById('user-name').innerText = username;
 
  if (username === 'gieras') {
    document.getElementById('user-icon').src = 'assets/img/gieraspfp.png';
  }
  if (username === 'pitulec') {
    document.getElementById('user-icon').src = 'assets/img/pitulec.jpeg';
  }
  if (username === 'mina' || username === 'drill') {
    document.getElementById('user-icon').src = 'assets/img/mina.jpeg';
  }
  if (username === 'jastrzab'|| username === 'jastrząb') {
    document.getElementById('user-icon').src = 'assets/img/jastrząb_zse.png';
  }
  if (username === 'cekol') {
    document.getElementById('user-icon').src = 'assets/img/cekol.png';
  }
  if (username === 'warkusz') {
    document.getElementById('user-icon').src = 'assets/img/pitulecDiabel.jpg';
  }
 
 
  const chips = document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1];
  document.getElementById('token_count').innerText = chips;
 

  if (chips === "69" || chips === "6969") {
    document.body.classList.add("pinkmode");
  } else {
    document.body.classList.remove("pinkmode");
  }
}
 
function redirectToHome() {
  window.location.href = 'index.html';
}
 
function editUserName() {
  const userNameSpan = document.getElementById('user-name');
  const editNameTextarea = document.getElementById('edit-name');
 
  userNameSpan.style.display = 'none';
  editNameTextarea.style.display = 'block';
  editNameTextarea.value = userNameSpan.innerText;
  editNameTextarea.focus();
 
  editNameTextarea.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
 
      userNameSpan.innerText = editNameTextarea.value.trim() || 'nazwa użytkownika';
      userNameSpan.style.display = 'block';
      editNameTextarea.style.display = 'none';
      document.cookie = "username=" + editNameTextarea.value + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
      window.location.reload();
    }
  });
}
 
function resetTokens() {
  if (confirm("Czy na pewno chcesz zresetować swoje żetony?")) {
    document.cookie = "chips=1000; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
    updateUserInfo();
  }
}
 
function toggleDarkMode() {
  const isDark = document.body.classList.toggle("darkmode");
  document.getElementById('darkmode-toggle').innerText = isDark ? '☀️' : '🌙';
  document.cookie = "darkmode=" + (isDark ? "on" : "off") + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
 
  const chips = document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1];
  if (chips === "69" || chips === "6969") {
    document.body.classList.add("pinkmode");
  } else {
    document.body.classList.remove("pinkmode");
  }
}
 
(function checkDarkModeOnLoad() {
  const darkCookie = document.cookie.split("; ").find(row => row.startsWith("darkmode="))?.split("=")[1];
  if (darkCookie === "on") {
    document.body.classList.add("darkmode");
    const toggle = document.getElementById('darkmode-toggle');
    if (toggle) toggle.innerText = '☀️';
  }
 
  const chips = document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1];
  if (chips === "69" || chips === "6969") {
    document.body.classList.add("pinkmode");
  }
})();

