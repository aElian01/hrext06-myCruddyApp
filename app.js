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

});