const socket = io()

// Client page

const userName = document.getElementById("userName").value;
const roomId = document.getElementById("roomId").value;

let form = document.getElementById('chat-form')
let input = document.getElementById('msg')
let ul = document.getElementById('users')
let room = document.getElementById('room-name')


// Join chatroom
socket.emit("joinRoom", { userName, roomId });


// Get message from input
form.addEventListener('submit', e => {
    e.preventDefault() // page does not reload when the user sends messages
    const message = input.value
    if (message) {  // if input contains something
        socket.emit('chat message', message) // send message
    }

    input.value = '' // delete message from input when user sends it
    input.value.focus() // focus in input 
})



// Show message in chat
socket.on('chat message',  message => {  // when comes  message
    const div = document.createElement('div')// create new div
    div.classList.add('message') // add class message
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div); // put message in chat

    //Scroll down
  const chatMessages = document.querySelector('.chat-messages');
  chatMessages.scrollTop = chatMessages.scrollHeight;

  })


//Fetch and render users 
renderUsers = (users) => {
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = user.name;
    ul.appendChild(li);
    
  });
};

fetchUsers = () => {
  fetch('/chat/users', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      renderUsers(data);
    });
};

// When page is loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();

  // File uppload
document.getElementById('form-upload').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('fileinput');
  const uploadFile = input.files[0];
  const data = new FormData();
  data.append('uploadFile', uploadFile);
  fetch('/chat/upload', {
      method: 'POST',
      body: data
  })
      .then(response => {
          const text = '<a href="/public/uploads/' + uploadFile.name + '" target=_blank>' + uploadFile.name + '</a>';
          document.getElementById('msg').value = text;
      })
      .catch(error => { console.log(error)});
});
});
