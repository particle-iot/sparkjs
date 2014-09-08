var jqueryLoaded = function() {
  loadScript('https://rawgit.com/kylefox/jquery-modal/master/jquery.modal.min.js');
};

loadCSS('https://rawgit.com/kylefox/jquery-modal/master/jquery.modal.css');
loadScript('https://code.jquery.com/jquery-2.1.1.min.js', jqueryLoaded);

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

function loadScript(url, callback) {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  script.onreadystatechange = callback;
  script.onload = callback;

  head.appendChild(script);
}

function loadCSS(url, callback) {
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/javascript';
  link.media = 'screen';
  link.href = url;

  link.onreadystatechange = callback;
  link.onload = callback;

  head.appendChild(link);
}
