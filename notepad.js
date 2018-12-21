$(document).ready(function(){
 
  $('.btn-submit').on('click', function(){
    var usernameField = $('#inputUsername').val();
    var noteField = $('#inputNote').val();
    var user = User.load(usernameField);
    if (user === undefined) {
      user = new User(usernameField);
    } 

    var note = new Note(null, noteField, user.id);
    $('.list-display-field').prepend(makeNoteHTML(user.username, note.body, note.created_at));
  }); 

  $('.btn-search').on('click', function() {
    var searchTag = $('#searchHashtag').val();
    var notes = Note.findByHashtag(searchTag);
    $('.list-display-field').empty();
      console.log(notes);

    for (var note of notes) {
      $('.list-display-field').prepend(makeNoteHTML(note.user.username, note.body, note.created_at));
    }
  });

  $('.btn-back').on('click', function() {
    $('.list-display-field').empty();
    var noteHTML = Note.index().map(function(note) {
      return makeNoteHTML(note.user.username, note.body, note.created_at);
    });
    for (var note of noteHTML) {
      $('.list-display-field').append(note);
    }
   
  });

  var makeNoteHTML = function(username, body, created_at) {
    var $note = $('<div></div>');
    $note.append($('<span class="username"></span').text(username));
    $note.append($('<span class="body"></span>').text(body));
    $note.append($('<span class="timestamp"></span').text(moment(created_at).fromNow()));
    return $note;
  }


  //create user model which stores user id and username
  var User = function(username, id) {
    this.username = username;
    this.id = id;
    this.save();
  }

  /*

  {'Users': {
    '1': {'username': 'eliana'}, 
    '2': {'username': 'bigo'}}
  }
  */

  //save and retrieve user from db
  User.prototype.save = function() {

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

    // uniqueness check - does this username already exist?
    if (this.id === undefined) {
      for (var key in users) {
        if (users[key]['username'] === this.username) {
          throw new Error("username '" + this.username + "' already exists");
        }
      }
      this.id = Object.keys(users).length;
    }

    var user = {
      username: this.username
    }

    users[this.id] = user;

    // stage 3
    localStorage.setItem('Users', JSON.stringify(users));
  }
 
  User.prototype.delete = function() {
    var data = JSON.parse(localStorage.getItem('Users'));
    if (data === null) {
      data = {};
    }
    delete data[this.id];

    // delete associated notes
    var notes = JSON.parse(localStorage.getItem("Notes"));
    for (var note_id in notes) {
      if (notes[note_id]['user_id'] === this.id) {
        delete notes[note_id];
      }
    }
    localStorage.setItem('Notes', JSON.stringify(notes))


    localStorage.setItem('Users', JSON.stringify(data));

  }

  User.prototype.notes = function() {
    var data = JSON.parse(localStorage.getItem('Notes'));
    var notes = [];
    for (var key in data) {
      if (data[key]['user_id'] == this.id) {
        var note_data = data[key];
        notes.push(Note.loadFromRaw(data, key));
      } 
    }
    return notes;

  }

  User.load = function(usernameOrID) {
    //retrieve table data from db
    var data = JSON.parse(localStorage.getItem('Users'));


    //find the user
    if (typeof usernameOrID === 'number') {
      var user = new User(data[usernameOrID]['username'], usernameOrID);
      return user;
    } else {
      for (var key in data) {
        if (data[key]['username'] === usernameOrID) {
          var user = new User(usernameOrID, key);
          return user; 
        } 
      } 
    }
  }

  // Constructor to create a new note or instantiate one from the DB
  var Note = function(title, body, user_id, id) {
    this.title = title;
    this.body = body;
    this.user_id = user_id;
    this.user = User.load(this.user_id);
    this.id = id;
    if (this.id === undefined) {
      this.created_at = Date.now();
    }
    this.save()
  }

  // Method to save the current note to the DB, regardless of whether it's there already
  Note.prototype.save = function() {
    // load up existing notes from the DB
    var notes = JSON.parse(localStorage.getItem('Notes'));
    if (notes === null) {
      notes = {};
    }

    // if this note has no ID (hasn't been saved yet), assign it one
    if (this.id === undefined) {
      this.id = Object.keys(notes).length;
    }

    // find hashtags in the note
    var hashtags = this.body.match(/#\w+/gi);

    var note = {
      title: this.title,
      body: this.body,
      user_id: this.user_id,
      created_at: this.created_at,
      hashtags: hashtags
    }

    // update notes object in memory
    notes[this.id] = note;

    // save it back to the DB
    localStorage.setItem('Notes', JSON.stringify(notes));
  }

  Note.prototype.delete = function() {
    var notes = JSON.parse(localStorage.getItem('Notes'));
    if (notes === null) {
      notes = {};
    }
    delete notes[this.id];
    localStorage.setItem('Notes', JSON.stringify(notes));
  }

  // Load an existing note from the DB
  Note.load = function(id) {
    var notes = JSON.parse(localStorage.getItem('Notes'));
    if (notes.hasOwnProperty(id)) {
      return Note.loadFromRaw(notes, id)
    }
  }

  Note.loadFromRaw = function(obj, id) {
    var title = obj[id]['title'];
    var body = obj[id]['body'];
    var user_id = obj[id]['user_id'];
    var note = new Note(title, body, user_id, id);
    note.created_at = obj[id]['created_at'];
    note.hashtags = obj[id]['hashtags'];
    return note;
  }

  Note.index = function() {
    var notes = JSON.parse(localStorage.getItem('Notes'));
    var allNoteIds = Object.keys(notes);
    var allNotes = allNoteIds.map(function(note_id) {
      return Note.load(note_id);
    })
    allNotes.sort(function(a,b) {return a-b;});
    return allNotes;
  }

  Note.findByHashtag = function(hashtag) {
    var notes = JSON.parse(localStorage.getItem('Notes'));
    var matchingNotes = [];
    for (var key in notes) {
      if (notes[key]['hashtags'].includes(hashtag)) {
        matchingNotes.push(Note.loadFromRaw(notes, key))
      }
    }
    return matchingNotes;
  }

  Note.getHashtagCounts = function() {
    var notes = JSON.parse(localStorage.getItem('Notes'));
    var tagCounts = {};
    for (var key in notes) {
      for (var tag of notes[key]['hashtags']) {
        if (!tagCounts.hasOwnProperty(tag)) {
          tagCounts[tag] = 1;
        } else { 
          tagCounts[tag] += 1;
        }
      }
    }
    return tagCounts
  }


  // THESE ARE OUR TESTS DON'T DELETE THEM
  localStorage.clear();
  window.eliana = new User('eliana');
  try {
    new User("eliana");
  } catch {}
  User.load('eliana');
  window.oliver = new User('oliver');
  oliver.username = 'bigo';
  oliver.save();

  window.eliana = User.load('eliana');
  window.bigo = User.load('bigo');

  window.note1 = new Note("title 1", "body 1 #hashtag1 #hashtag2", 0);
  window.note2 = new Note("title 2", "body 2 #hashtag 3", 0);
  window.note3 = new Note("title 3", "body 3 #hashtag2", 1)
  window.note4 = new Note("title 4", "body 4 #hashtag2", 1)
  // oliver.delete();
  // console.log(eliana.notes());
  // console.log(Note.findByHashtag("#hashtag2"))
  // console.log(Note.getHashtagCounts());


});