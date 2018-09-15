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
    let memberStats = {
      memberName: leaderUID
    };
    firebase.database().ref("groups/" + leaderUID)
    .push(memberStats)
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
        let memberStats = {
          memberName: myUID
        };
        firebase.database().ref("groups/" + leaderUID)
        .push(memberStats);
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
// MOSTRAR MODAL

function mostrarModal(nombre) {
  
  
  $("#modal-title").html(nombre);
  $("#modal-one").modal("show");
  map = new GMaps({
    div: '#mapa-pariente',
    lat: -12.043333,
    lng: -77.028333
  });
}

//funcion para cargar a todas las personas dentro de mi red familiar
const chargeGroupMembers = (currentUserUID) => {
  getDataFirebase('users/'+currentUserUID).then(userData => {
    if(userData.group !== null) {
      let members = document.getElementById('groupMembers');
      let modalsForMemberStadistics = document.getElementById('modalsForMemberStadistics');
      getDataFirebase('groups/'+ userData.group).then(groupData => {
        membersKeys = Object.keys(groupData);
        console.log(membersKeys)
        membersKeys.forEach(memberUID => {
          console.log(groupData[memberUID])
          getDataFirebase('users/'+groupData[memberUID].memberName).then(memberData => {
            members.innerHTML += `
            <div class="card">
              <div class="card-body">
              <h1>${memberData.nombre}</h1>
              <img width='100px' src= ${memberData.foto} />
              <button type="button" onclick="mostrarModal('${memberData.nombre}');" class="btn" data-toggle="modal" data-target=${'#R'+memberData.uid}>Reporte</button>
              </div>
            </div>`;
          })
        })
      })
    } else {
      console.log('no perteneces a una red familiar aun');
    }
  })
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
