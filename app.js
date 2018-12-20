$(document).ready(function(){
  console.log('jQuery loaded');

  // write to local storage from input when button save clicked; store multiple
  $('.btn-submit').on('click', function(){
    var inputFieldValue = localStorage.getItem('inputFieldValue');  
    if (inputFieldValue === null) {
      var inputFieldValuesInArr = [];
    } else {
      inputFieldValuesInArr = JSON.parse(inputFieldValue);
    }
    inputFieldValuesInArr.push($('.text-entry').val());
    localStorage.setItem('inputFieldValue', JSON.stringify(inputFieldValuesInArr));
    var myItemInStorage = JSON.parse(localStorage.getItem('inputFieldValue'));
    console.log('myItemInStorage', myItemInStorage);
    
    // display the value here
    $('.list-display-field').text(myItemInStorage); // ??
  }); 

  // delete from local storage when delete button clicked
  $('.btn-delete').on('click', function(){
    var inputFieldValue = JSON.parse(localStorage.getItem('inputFieldValue'));
    if (inputFieldValue !== null) {
      if (inputFieldValue.includes($('.text-entry').val())) {
        var startIndex = inputFieldValue.indexOf($('.text-entry').val())
        inputFieldValue.splice(startIndex, 1);
        localStorage.setItem('inputFieldValue', JSON.stringify(inputFieldValue));  
      }
    }
    var myItemInStorage = JSON.parse(localStorage.getItem('inputFieldValue'));
    $('.list-display-field').text(myItemInStorage); 
  });

  // delete all values when delete all button clicked
  $('.btn-deleteall').on('click', function(){
    localStorage.clear();
    var myItemInStorage = JSON.parse(localStorage.getItem('inputFieldValue'));
    $('.list-display-field').text(myItemInStorage); 
  });







  //create user model which stores user id and username
  var User = function(username, id) {
    console.log("** calling new User('"+username+"')");  

    this.username = username;
    this.id = id;
    this.save();
  }

  /*
  {'inputFieldValue': ['haha', 'boohoo']}

  {'Users': {
    '1': {'username': 'eliana'}, 
    '2': {'username': 'bigo'}}
  }
  */

  //save and retrieve user from db
  User.prototype.save = function() {
    console.log("** calling User.save('"+this.username+"')");  

    //user object where key is the id and value is the username

    // in all of our DB interactions there are going to be three stages
    // stage 1 - retrieve the whole table data from the database and JSON.parse it
    // stage 2 - manipulate the resulting javascript objects in memory
    // stage 3 - store the whole table data back as JSON into the DB

    // stage 1
    var users = JSON.parse(localStorage.getItem('Users'));
    if (users === null) {
      users = {};
    }

    // stage 2
    if (this.id === undefined) {
      this.id = Object.keys(users).length;
    } 

    var user = {
      username: this.username
    }

    users[this.id] = user;

    // stage 3
    localStorage.setItem('Users', JSON.stringify(users));
  }
 
  User.load = function(username) {
    console.log("** calling User.load('"+username+"')");  
    //retrieve table data from db
    var data = JSON.parse(localStorage.getItem('Users'));
    //find the user
    for (var key in data) {
      if (data[key]['username'] === username) {
        var user = new User(username, key);
        return user; 
      } 
    } 
    //instantiate User object for the user
  }



  // THESE ARE OUR TESTS DON'T DELETE THEM
  localStorage.clear();
  window.eliana = new User('eliana');
  User.load('eliana');
  window.oliver = new User('oliver');
  oliver.username = 'bigo';
  oliver.save();

  window.eliana = User.load('eliana');
  window.bigo = User.load('bigo');
  User.load('wha')

});