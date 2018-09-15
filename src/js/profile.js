//cargando todo del muro
const welcomeUser = (uid) => {
  let profile = firebase.database().ref().child('users/'+uid);
  profile.on('value', snap => {
    let userData = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
    userData = JSON.parse(userData);
    document.getElementById("userName").innerHTML = userData.nombre;
    document.getElementById('userPhoto').innerHTML = "<img id='user-photo' width='100px' class='circle img-responsive' src='"+userData.foto+"  '/>"
    document.getElementById('userEmail').innerHTML = userData.email;
    document.getElementById('userUID').value = userData.uid;
    document.getElementById('userUID').readOnly = true;
  })
  // let muroPosts = document.getElementById('myPosts');
  // muroPosts.innerHTML = '';
  // chargeFriendPosts();
  // chargePosts(userUID,muroPosts);
  // chargeNotifications();
  // // window.location.reload();
  // chargePostsPublic();
}
//funcion para copiar el id del usuario
const copyResult = () => {
  /* Get the text field */
  let copyText = document.getElementById("userUID");
  console.log(copyText)
  /* Select the text field */
  copyText.select();
  /* Copy the text inside the text field */
  document.execCommand("copy");
}

//funcion para cerrar sesion
const closeSession = () => {
  firebase.auth().signOut()
  .then(function () {
    document.location.href = 'index.html';
  })
  .catch(function (error) {
    console.log(error);
  })
}
