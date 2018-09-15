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
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var state = getParameterByName('estado');
console.log(state);
if(state !=''){
  console.log(state)
  if(state =='1#'){
    shareLocationState(userUID,'Estoy bien');
  } else {
    shareLocationState(userUID,'Estoy mal, Ayuda');
  }
}
