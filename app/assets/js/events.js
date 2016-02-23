"use strict";

(function(){
  if(document.getElementById('register')) {
    let register = document.getElementById('register');
    register.addEventListener('click', (e)=> {

      document.getElementById('regform').classList.toggle('hide');
    });
  }

})();
