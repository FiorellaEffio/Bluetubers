//cargando data del usuario para el muro
const welcomeUser = (uid) => {
  let pathUser = 'users/'+uid;
  getDataFirebase(pathUser).then(userData => {
    document.getElementById("userName").innerHTML = userData.nombre;
    document.getElementById('userPhoto').innerHTML = "<img id='user-photo' width='100px' class='circle img-responsive' src='"+userData.foto+"  '/>"
    document.getElementById('userEmail').innerHTML = userData.email;
    document.getElementById('userUID').value = userData.uid;
    document.getElementById('userUID').readOnly = true;
  })
}
//funcion con promesa para retornar data
const getDataFirebase = (path) => {
  return new Promise((resolved, reject) => {
    let data = firebase.database().ref().child(path);
    data.on('value', snap => {
      let userData = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
      userData = JSON.parse(userData);
      resolved(userData);
    })
  })
}

//funcion para añadir miembros de la red familiar
const addRelative = () => {
  //antes de agregar a un lider, este debe existir
  let leaderUID = document.getElementById('leaderUID').value;
  let myUID = document.getElementById('userUID').value;
  if(leaderUID === myUID) {
    console.log('eres lider');
    let profile = firebase.database().ref().child('groups/' + leaderUID);
    firebase.database().ref("groups/" + leaderUID)
    .push(leaderUID)
  } else if (leaderUID !== '') {
    let pathGroup = 'groups/'+leaderUID;
    getDataFirebase(pathGroup).then(groupData => {
      console.log(groupData);
      if(groupData == null) {
        console.log('No existe el lider');
      } else {
        firebase.database().ref("groups/" + leaderUID)
        .push(myUID)
        console.log('Ya estas en la red familiar')
      }
    })
  } else {
    console.log('Ingresa el UID de tu lider')
  }
}

//funcion para copiar el id del usuario
const copyCurrentUserUID = () => {
  /* Get the text field */
  let copyText = document.getElementById("userUID");
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
