//Funcion inicio de sesion con proveedor google o Facebook
const loginWithProvider = (provider) => {
  firebase.auth().signInWithPopup(provider)
  .then(function(result) {
    let user = firebase.auth().currentUser;
    writeDatabase(result.user);
    localStorage.currentUser = user.uid;
  });
}
//Escribiendo en la base de datos el profile del usuario
const writeDatabase = (user) => {
  //muestrame si existe el usuario
  let profile = firebase.database().ref().child('users/' + user.uid);
  profile.on('value', snap => {
    let userData = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
    userData = JSON.parse(userData);
    if(userData == null) {
      let usuario = {
        uid : user.uid,
        nombre: user.displayName,
        email:user.email,
        foto: user.photoURL
      }
      firebase.database().ref("users/" + usuario.uid)
      .set(usuario)
      document.location.href = 'profile.html';
    } else {
      //ya existia el usuario
      document.location.href = 'profile.html';
    }
  })
}
