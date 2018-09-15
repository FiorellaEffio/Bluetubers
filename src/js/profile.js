//cargando data del usuario para el muro
const welcomeUser = (uid) => {
  let pathUser = 'users/'+uid;
  getDataFirebase(pathUser).then(userData => {
    document.getElementById("userName").innerHTML = userData.nombre;
    document.getElementById('userPhoto').innerHTML = "<img id='user-photo' width='100px' class='img-avatar' src='"+userData.foto+"  '/>"
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

//funcion para a�adir miembros de la red familiar
const addRelative = () => {
  //antes de agregar a un lider, este debe existir
  let leaderUID = document.getElementById('leaderUID').value;
  let myUID = document.getElementById('userUID').value;
  if(leaderUID === myUID) {
    console.log('eres lider');
    let profile = firebase.database().ref().child('groups/' + leaderUID);
    firebase.database().ref("groups/" + leaderUID)
    .push(leaderUID)
    getDataFirebase('users/'+myUID).then(userData => {
      console.log(userData)
      userData.group = leaderUID;
      firebase.database().ref("users/" + myUID)
      .set(userData)
    })
  } else if (leaderUID !== '') {
    let pathGroup = 'groups/'+leaderUID;
    getDataFirebase(pathGroup).then(groupData => {
      console.log(groupData);
      if(groupData == null) {
        console.log('No existe el lider');
      } else {
        firebase.database().ref("groups/" + leaderUID)
        .push(myUID)
        getDataFirebase('users/'+myUID).then(userData => {
          console.log(userData)
          userData.group = leaderUID;
          firebase.database().ref("users/" + myUID)
          .set(userData)
        })
        chargeGroupMembers(myUID);
        console.log('Ya estas en la red familiar')
      }
    })
  } else {
    console.log('Ingresa el UID de tu lider')
  }
}
//funcion para cargar a todas las personas dentro de mi red familiar
const chargeGroupMembers = (currentUserUID) => {
  getDataFirebase('users/'+currentUserUID).then(userData => {
    if(userData.group !== null) {
      let members = document.getElementById('groupMembers');
      getDataFirebase('groups/'+ userData.group).then(groupData => {
        membersKeys = Object.keys(groupData);
        membersKeys.forEach(memberUID => {
          getDataFirebase('users/'+groupData[memberUID]).then(memberData => {
            members.innerHTML += `<div>${memberData.nombre} <img width='100px' src= ${memberData.foto} /> <button id=${memberData.uid} onclick="stadistics('${memberData.uid}')">Reporte</button></div>`;
          })
        })
      })
    } else {
      console.log('no perteneces a una red familiar aun');
    }
  })
}
//funcion para estadisticas de las personas de mi red familiar
const stadistics = (memberUID) => {
  console.log(memberUID);

  let modalForRestaurantContainer = document.getElementById('modalsForRestaurants');
  modalsForRestaurants.innerHTML += `
  <div class="modal fade" id=${'R'+objRestaurant.id} role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">${objRestaurant.name}</h4>
          <img src=""/>
        </div>
        <div class="modal-body">
          <div id=${'M'+objRestaurant.id}></div>
          <p>Ubicado en : ${objRestaurant.vicinity}</p>
          <p>Abierto ahora: ${answerOpenNow}</p>
          <p>Calificaci�n: ${objRestaurant.rating}</p>
          <span class="fa fa-star checked"></span>
          <span class="fa fa-star checked"></span>
          <span class="fa fa-star checked"></span>
          <span class="fa fa-star"></span>
          <span class="fa fa-star"></span>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  `;

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
