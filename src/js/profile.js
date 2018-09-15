//cargando todo del muro
const welcomeUser = (uid) => {
  let path = 'users/'+uid;
  getDataFirebase(path).then(userData => {
    document.getElementById("userName").innerHTML = userData.nombre;
    document.getElementById('userPhoto').innerHTML = "<img id='user-photo' width='100px' class='circle img-responsive' src='"+userData.foto+"  '/>"
    document.getElementById('userEmail').innerHTML = userData.email;
    document.getElementById('userUID').value = userData.uid;
    document.getElementById('userUID').readOnly = true;
  })
}
//funcion con promesa
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
  } else {
    let myRelatives = firebase.database().ref().child('groups/'+leaderUID);
    myRelatives.on('value', snap => {
      let userData = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
      userData = JSON.parse(userData);
      console.log(userData);
      if(userData == null) {
        console.log('No existe el lider');
      } else {
        firebase.database().ref("groups/" + leaderUID)
        .push(myUID)
        console.log('Ya estas en la red familiar')
      }
    })
  }


  // if(leaderUID) {
  //   document.getElementById('currentPost').value = '';
  //   let optionValue = document.getElementById('privateOptions');
  //   optionValue = optionValue.options[optionValue.selectedIndex].value;
  //   firebase.database().ref('users/'+userUID+'/publicaciones').push({
  //     optionValue,
  //     message
  //   });
  //   let muroPosts = document.getElementById('myPosts');
  //   muroPosts.innerHTML = '';
  //   chargePosts(userUID, muroPosts);
  // } else {
  //   alert('No se permite publicar algo vacio')
  // }
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
