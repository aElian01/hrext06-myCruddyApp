# hrext06-myCruddyApp
Create Read Update Delete using localStorage with JS, HTML and CSS


## Notes2Self App

### Sprint 1: basic CRUD overview using localStorage
(the unchecked boxes are required to finish)
- [x] Form with input fields
- [x] Write to local storage
- [x] Read from local storage
- [x] Edit local storage
    - [x] What about if we have more than one value?
    - [x] how do we add multiple values?
        - [x] maybe use an array?
        - [ ] maybe use multiple keys? create new keyname each time

- [x] Delete local storage
    - [x] delete button storage.removeItem()
    - [x] delete all storage.clear()
- [x] Display stored value in proper div


### Sprint 2: creating a user model and a notes model
- [ ] create user model which stores user id and username
	- [ ] be able to save and retrieve user from db
- [ ] create a notes model which stores notes id, title, body
	- [ ] be able to save and retrieve notes from db
- [ ] extend user and notes model for update and delete
- [ ] extend user model to retrieve all notes by user
- [ ] extend note model to retrieve notes in chronological order


### Sprint 3: adding hashtags and hashtag cloud
- [ ] extend notes model and table to support hashtags
- [ ] parse and update hashtags out of note bodies
- [ ] ability to query notes by hashtag
- [ ] implement a way to get unique tag counts


### Sprint 4: add UI 
- [ ] implement homepage
	- [ ] input field for note / code snippet
	- [ ] list of recent notes / snippets
	- [ ] hashtag cloud
- [ ] individual note page for editing note
- [ ] list of notes by tag
- [ ] list of notes by user
- [ ] user login / signup page


