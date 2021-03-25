const socket = io()

// Klient sida
const userName = document.getElementById("userName").value;
const roomId = document.getElementById("roomId").value;

let form = document.getElementById('chat-form')
let input = document.getElementById('msg')
let ul = document.getElementById('users')
let room = document.getElementById('room-name')


// Join chatroom
socket.emit("joinRoom", { userName, roomId });


// Message från input
form.addEventListener('submit', e => {
    e.preventDefault() // för att sida inte laddas om när användaren sckikar meddelade
    const message = input.value
    if (message) {  // om input inehåller nåt sckicka event
        socket.emit('chat message', message) // skicka meddelande, 'chat message' - kan bli vad som helst
    }

    input.value = '' // ta bort meddelade från input när användaren skickar det
    input.value.focus() // focus i input efter
})



// Visa message i chaten
socket.on('chat message',  message => {  // när det kommer chat message 
    const div = document.createElement('div')// skapa ny div
    div.classList.add('message') // add class message
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div); // lägga message i chat

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

//Funktioner som ska köras när  sida laddas
document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
});
