var $ = require('jquery');
var jModal = require('../vendor/jquery.modal.min.js')
var cssify = require('cssify')

cssify.byUrl('https://rawgit.com/kylefox/jquery-modal/master/jquery.modal.css');

window.sparkLogin = function(callback) {
  addLoginForm('login-form');
  addBehaviour('login-form', callback);
};

function addLoginForm(formId) {
  var form = document.createElement('form');
  form.id = formId;
  form.class = 'modal';

  form.appendChild(generateInput(formId, 'username', 'text'));
  form.appendChild(generateInput(formId, 'password', 'password'));
  form.appendChild(generateButton(formId));

  document.body.appendChild(form);
}

function addBehaviour(formId, callback) {
  $('#' + formId).modal();
  $('#' + formId + '-button').click(function(e) {
    e.preventDefault();
    var spark = require('./spark.js');
    var user = $('#' + formId + '-username').val();
    var pass = $('#' + formId + '-password').val();

    spark.login({username: user, password: pass}, callback);
  });
}

function generateInput(formId, name, type) {
  var input = document.createElement("input");
  input.id = formId + '-' + name;
  input.type = type;
  input.class = 'login-input';

  return input;
}

function generateButton(formId) {
  var btn = document.createElement("button");
  btn.id = formId + '-button';
  btn.appendChild(document.createTextNode("LOGIN"));

  return btn;
}
