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

function mostrarModal(nombre,lat, lng) {
  console.log(lat)
  $("#modal-title").html(nombre);
  $("#modal-one").modal("show");
  if(lat !== undefined && lng !== undefined){
    map = new GMaps({
      div: '#mapa-pariente',
      lat,
      lng
    });
  } else {
    console.log('Esta persona no ha compartido su ubicacion aun')
  }

}
//funcion para mandar ubicacion a mi grupo familiar
const shareLocation = (userUID) => {
  console.log(userUID)
  getDataFirebase('users/'+userUID).then(dataUser => {
    console.log(dataUser)
  })
  getDataFirebase('users/'+userUID).then(userData => {
    getDataFirebase('groups/'+userData.group).then(groupData => {
      membersOfGroup = Object.keys(groupData);
      membersOfGroup.forEach(memberID => {
        if(userUID===groupData[memberID].memberName){
          console.log('este es mi usuario')
          console.log(groupData[memberID])
          memberNewData = groupData[memberID];
          navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position.coords.latitude)
            memberNewData.location = {
              lat:position.coords.latitude,
              lng:position.coords.longitude
            };
            firebase.database().ref("groups/" + userData.group+'/'+memberID)
            .set(memberNewData)
          });
        }
      })
    })
  })
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
            console.log(groupData[memberUID].location.lat)
            members.innerHTML += `
            <div class="card-user">
              <div class="row">
                <div class="col-md-2">
                  <div class="text-center">
                  <img width='100px' class="img-avatar" src= ${memberData.foto} />
                  </div>
                </div>
                <div class="col-md-10">
                  <h3 class="user-title">${memberData.nombre}</h3>
                  <p class="user-type">Pariente</p>
                  <button type="button" onclick="mostrarModal('${memberData.nombre}','${groupData[memberUID].location.lat}','${groupData[memberUID].location.lng}');" class="btn btn-sm btn-info" data-toggle="modal" data-target=${'#R'+memberData.uid}>
                  <i class="fa fa-eye" aria-hidden="true"></i>
                      Reporte
                  </button>
                </div>
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
