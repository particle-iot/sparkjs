var $ = require('jquery');
var jModal = require('../vendor/jquery.modal.min.js');
var cssify = require('cssify');

cssify.byUrl('https://rawgit.com/kylefox/jquery-modal/master/jquery.modal.css');
require('./style.css');

window.sparkLogin = function(callback) {
  addLoginForm();
  addBehaviour(callback);
};

window.sparkModal = function() {
  $('#login-form').modal();
};

function addLoginForm() {
  var form = document.createElement('form');
  form.id = 'login-form';
  form.class = 'modal';

  form.appendChild(generateError());
  form.appendChild(generateInput('username', 'text'));
  form.appendChild(generateInput('password', 'password'));
  form.appendChild(generateButton());

  document.body.appendChild(form);
}

function addBehaviour(callback) {
  $('#login-form-button').click(function(e) {
    e.preventDefault();
    var spark = require('./spark.js');
    var user = $('#login-form-username');
    var pass = $('#login-form-password');

    var loginPromise = spark.login({
      username: user.val(),
      password: pass.val()
    });

    loginPromise.then(
      function(data) {
        callback(data);
        user.val('');
        pass.val('');
        displayErrorMessage('');
        $.modal.close();
      }.bind(user, pass),
      function(error) {
        if (error.message === 'invalid_client') {
          displayErrorMessage('Invalid credentials. Verify email and password.');
        } else if (error.cors === 'rejected') {
          displayErrorMessage('Request rejected. Check your internet connection.');
        } else {
          displayErrorMessage('Unknown error. Review console log for details.');
          console.log(error);
        }
      }
    );
  });
}

function generateError() {
  var div = document.createElement("div");
  div.id = 'login-form-error';

  return div;
}

function generateInput(name, type) {
  var input = document.createElement("input");
  input.id = 'login-form-' + name;
  input.type = type;
  input.class = 'login-input';

  return input;
}

function generateButton() {
  var btn = document.createElement("button");
  btn.id = 'login-form-button';
  btn.appendChild(document.createTextNode("LOGIN"));

  return btn;
}

function displayErrorMessage(message) {
  $('#login-form-error').text(message);
}
