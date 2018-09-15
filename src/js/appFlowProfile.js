//le damos la bienvenida al usuario actual
let userUID = localStorage.currentUser;
welcomeUser(userUID);
document.getElementById('closeSession').addEventListener('click', () => {
  closeSession();
})
document.getElementById('copyID').addEventListener('click', () => {
  copyCurrentUserUID();
})
document.getElementById('addRelative').addEventListener('click', () => {
  addRelative();
})
