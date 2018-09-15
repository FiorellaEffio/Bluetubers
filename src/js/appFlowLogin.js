let providerGoogle = new firebase.auth.GoogleAuthProvider();
document.getElementById('loginGoogle').addEventListener('click', () => {
  loginWithProvider(providerGoogle);
});
