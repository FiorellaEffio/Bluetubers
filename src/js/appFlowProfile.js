//le damos la bienvenida al usuario actual
let userUID = localStorage.currentUser;
welcomeUser(userUID);
chargeGroupMembers(userUID);
document.getElementById('closeSession').addEventListener('click', () => {
  closeSession();
})
document.getElementById('copyID').addEventListener('click', () => {
  copyCurrentUserUID();
})
document.getElementById('addRelative').addEventListener('click', () => {
  addRelative();
})
document.getElementById('shareLocation').addEventListener('click', () => {
  shareLocation(userUID);
})
