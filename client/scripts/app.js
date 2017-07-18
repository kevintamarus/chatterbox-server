// YOUR CODE HERE:
let app = {};

app.server = 'http://127.0.0.1:3000';
let lastID;
let tempID;

app.init = () => {
  app.fetch();
};

app.send = message => {
  $.ajax({
    url: app.server,
    data: JSON.stringify(message),
    type: 'POST',
    contentType: 'application/json',
    success: (data) => console.log('message sent', data),
    error: () => console.log('message not sent')
  });
};

app.fetch = () => {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {order: '-createdAt'},
    contentType: 'application/json',
    success: data => {
      app.renderMessage(data);
    },
    error: () => console.log('error')
  });
};

app.clearMessages = () => {
  $('#chats').html('');
};

app.renderMessage = data => {
  
  if (Array.isArray(data.results)) {
    let messages = data.results;
    lastID = messages[0].objectId;
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];
      let text = message.text;
      let roomname = message.roomname;
      let username = message.username;
      
      //let elements = `<span class="username">${username}</span><div class="text">${text}</div>`;
      if (roomname === $('#room-name').html().toLowerCase() ) {
        let userDiv = $('<div/>').text(username).addClass('username');
        let textDiv = $('<div/>').text(text).addClass('usertext');
          
        $('<div/>')
        .append(userDiv)
        .append(textDiv)
        .addClass('message')
        .appendTo('#chats');
      }
    
    } 
  } else {
    // For test case where input is a message object instead of a data object
    let text = data.text;
    let roomname = data.roomname;
    let username = data.username;
    
    $('<div/>')
      .text(username + ' ' + text)
      .appendTo('#chats');
  }
};

app.renderRoom = () => {
  let newRoomName = prompt('Name your room:');
  let newOption = `<option value=${newRoomName.toLowerCase().split(' ').join('-')} selected>${newRoomName}</option>`;
  $('select').append(newOption);
  $('#room-name')
    .text(newRoomName)
    .attr('data-room', newRoomName.toLowerCase());
  
  app.clearMessages();
};

app.updateFetch = () => {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {order: '-createdAt'},
    contentType: 'application/json',
    success: data => {
      app.renderNewMessages(data);
    },
    error: () => console.log('Update Failed')
  });
  
  setTimeout(app.updateFetch, 3000);
};

app.renderNewMessages = data => {
  let messages = data.results;
  
  if (lastID !== messages[0].objectId) {

    tempID = messages[0].objectId;
    let index = 0;
    let arr = [];
    while (lastID !== messages[index].objectId) {
      arr.unshift(messages[index]);
      index++;
    }
    arr.forEach(function(obj) {
      let text = obj.text;
      let roomname = obj.roomname;
      let username = message.username;
      
      let userDiv = $('<div/>').text(username).addClass('username');
      let textDiv = $('<div/>').text(text).addClass('usertext');
      
      $('<div/>')
        .append(userDiv)
        .append(textDiv)
        .addClass('message')
        .prependTo('#chats');
    });
    
    lastID = tempID;
  }
};

app.handleUsernameClick = () => {};

app.handleSubmit = () => {};

$(document).ready(() => {

  app.init();
  app.updateFetch();

  $('#post-message').on('click', () => {
    let username = window.location.search.slice(10);
    let message = $('#message').val();
    let roomName = $('#room-name').data('room');
    let data = {
      username: username,
      text: message,
      roomname: roomName
    };
    app.send(data);
    
    $('#message').val('');
  });
  
  $('#clear-message').on('click', () => {
    app.clearMessages();
  });

  $('#make-room').on('click', () => {
    app.renderRoom();
  });

  $('select').change(() => {
    app.clearMessages();
    app.init();
    let room = $('select').val().split('-').join(' ');
    $('#room-name')
      .text(room)
      .attr('data-room', room.toLowerCase());
  });

});