
const btnCadastro = document.querySelector('#btnCadastro');
const btnEntrar = document.querySelector('#entrar');

const txtUserIdent = document.querySelector('#usernameLogin');
const txtUserPassword = document.querySelector('#senhaLogin');

btnCadastro.addEventListener('click', () => {
  extern.openPageExternally('https://google.com');
})

btnEntrar.addEventListener('click', (e) => {

  e.preventDefault();

  console.log(txtUserIdent.value);
  console.log(txtUserPassword.value);
  currentSession.login(txtUserIdent.value, txtUserPassword.value)
    .then((result) => {
      if(result) {
        window.close();
      } else {
        // currentSession.wrongLoginDialog();
      }
    });
})