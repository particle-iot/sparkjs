var $ = require('jquery');
var jModal = require('../vendor/jquery.modal.min.js');
var cssify = require('cssify');

require('./spark-browser-style.css');

window.sparkLogin = function(callback) {
  addLoginButton();
  addLoginForm();
  addBehaviour(callback);
};

window.spark = require('./spark.js');

function addLoginButton() {
  var btn = document.createElement("button");
  btn.id = 'spark-login-button';
  btn.className = 'spark-login-button';
  btn.appendChild(document.createTextNode("Login to Spark"));
  btn.onclick = function() {
    $('#spark-login-form').modal();
  };

  if( $('#spark-login').length ) {
    $('#spark-login').append(btn);
  } else {
    document.body.appendChild(btn);
  }
}

function addLoginForm() {
  var form = document.createElement('form');
  form.id = 'spark-login-form';
  form.className = 'spark-login-modal';

  form.appendChild(generateError());
  form.appendChild(generateInput('email', 'text'));
  form.appendChild(generateInput('password', 'password'));
  form.appendChild(generateButton());

  document.body.appendChild(form);
}

function addBehaviour(callback) {
  $('#spark-login-form-button').click(function(e) {
    e.preventDefault();
    var user = $('#spark-login-form-email').val();
    var pass = $('#spark-login-form-password').val();

    var loginPromise = window.spark.login({ username: user, password: pass });

    loginPromise.then(
      function(data) {
        callback(data);
        $('#spark-login-form-email').val('');
        $('#spark-login-form-password').val('');
        displayErrorMessage('');
        $('#spark-login-form-error').hide();
        $.modal.close();
      },
      function(error) {
        if (error.message === 'invalid_client') {
          displayErrorMessage('Invalid username or password.');
        } else if (error.cors === 'rejected') {
          displayErrorMessage('Request rejected.');
        } else {
          displayErrorMessage('Unknown error.');
          console.log(error);
        }
      }
    );
  });
}

function generateError() {
  var div = document.createElement("div");
  div.id = 'spark-login-form-error';
  div.className = 'spark-login-error';

  return div;
}

function generateInput(name, type) {
  var input = document.createElement("input");
  input.id = 'spark-login-form-' + name;
  input.type = type;
  input.className = 'spark-login-input';
  input.placeholder = name;

  return input;
}

function generateButton() {
  var btn = document.createElement("button");
  btn.id = 'spark-login-form-button';
  btn.className = 'spark-login-button';
  btn.appendChild(document.createTextNode("log in"));

  return btn;
}

function displayErrorMessage(message) {
  $('#spark-login-form-error').show();
  $('#spark-login-form-error').text(message);
}
