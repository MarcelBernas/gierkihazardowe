if (document.cookie.split("; ").find((row) => row.startsWith("username="))?.split("=")[1] === undefined) {
    document.cookie = "username=" + window.prompt('Witaj w strefie hazardu! Proszę podać nazwę użytkownika.') + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
  }
  if (document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1] === undefined) {
    document.cookie = "chips=1000; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
  }
  function updateUserInfo() {
    document.getElementById('user-name').innerText = document.cookie.split("; ").find((row) => row.startsWith("username="))?.split("=")[1];
    document.getElementById('token_count').innerText = document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1];
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
      }
    });
  }
  function resetTokens() {
    if (confirm("Czy na pewno chcesz zresetować swoje żetony?")) {
      document.cookie = "chips=1000; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
      updateUserInfo();
      }
    }