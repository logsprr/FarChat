import React from 'react';
import firebase from 'firebase';
import uuid from 'uuid';
class Fire{
    constructor() {
      }
      uploadImage = async uri => {
        console.log('Uri de imagem ok 10%. uri:' + uri);
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const ref = firebase
            .storage()
            .ref('avatar')
            .child(uuid.v4());
          const task = ref.put(blob);
        
          return new Promise((resolve, reject) => {
            task.on(
              'state_changed',
              () => {
                  
              },
              reject /*  se tiver algum erro na callback  */,
              () => resolve(task.snapshot.downloadURL)
            );
          });
        } catch (err) {
          console.log('Falha no upload: ' + err.message); 
        }
      }
      updateAvatar = (url) => {
        var userf = firebase.auth().currentUser;
        if (userf != null) {
          userf.updateProfile({ avatar: url})
          .then(function() {
            console.log("Sucesso ao dar upload. url:" + url);
            alert("Sua foto foi salva.");
          }, function(error) {
            console.warn("Erro no update do avatar.");
            alert("Erro em subir sua foto:" + error.message);
          });
        } else {
          console.log("usuario sem foto");
          alert("Tente fazer o upload de novo");
        }
      }
    
}
const fire = new Fire();
export default fire;