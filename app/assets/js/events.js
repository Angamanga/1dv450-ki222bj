"use strict";
//adding eventlisteners to ui
  if(document.getElementById('register')) {
    var register = document.getElementById('register');
    register.addEventListener('click', function(e){
      document.getElementById('regform').classList.toggle('hide');
    });
  }
