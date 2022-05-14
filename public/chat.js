;((window) => {
    'use strict';

    class Chat {
        socket = undefined;

        constructor() {
            console.info('Chat running!');
        }

        connectToSocket() {
            this.socket = io();
        }

        createRoom() {
            this.socket.emit('createRoom', {
                user: this.getUserData().name,
                room: this.getUserData().room
            });
        }

        emitMessage() {
            this.socket.on('message', (message) => {
                this.outputMessage(message);
                this.scrollChatWindow();
                this.clearMessageForm();
            });
        }

        getRoomAndUsers() {
            this.socket.on('roomUsers', ({ room, users }) => {
                this.setRoom(room);
                this.setUsers(users);
            });
        }

        setRoom(room) {
            const roomName = document.getElementById('room');

            if (roomName) {
                roomName.innerHTML = room;
            }
        }

        setUsers(users) {
            let userList = document.getElementById('user-list');

            if (userList) {
                userList.innerHTML = `
                    ${users.map((user) => `<p>${user.user}</p>`).join('')}
                `;
            }
        }

        clearMessageForm() {
            this.getChatForm().message.value = '';
            this.getChatForm().message.focus();
        }

        scrollChatWindow() {
            const chatWindow = document.getElementById('chat-window');

            if (chatWindow) {
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        }

        getUserData() {
            const search = document.location.search;

            if (search && search !== '' || search !== null) {
                const params = new URLSearchParams(search);
                const name = params.get('name');
                const room = params.get('room');

                if (name !== '' && room !== '') {
                    return {
                        name: name,
                        room: room
                    }
                } else {
                    console.error('Params are empty!');
                }
            } else {
                console.error('There are no params!');
            }
        }

        outputMessage(message) {
            this.createMessageDOM(message);
        }

        createMessageDOM(message) {
            const messageBox = document.getElementById('messages-box');
            const messageBlock = document.createElement('div');

            messageBlock.classList.add('message');
            messageBlock.innerHTML = `
                <div class="info">
                    <span>${message.user}</span>
                    <span>${message.time}</span>
                </div>
                <div class="msg">${message.message}</div>
            `;

            messageBox && messageBox.appendChild(messageBlock);
        }

        getChatForm() {
            const form = document.getElementById('send-message');
            const message = document.getElementById('message');

            if (form && message) {
                return {
                    form: form,
                    message: message
                };
            } else {
                console.error('DomContent does not loaded!');
            }
        }

        getChatFormValues() {
            return {
                message: this.getChatForm().message.value !== '' ? this.getChatForm().message.value : false
            };
        }

        sendMessage() {
            this.getChatForm().form.addEventListener('submit', (e) => {
                e.preventDefault();

                let submit = false;

                if (!this.getChatFormValues().message) {
                    this.getChatForm().message.style.borderColor = 'darkred';
                    submit = false;
                } else {
                    this.getChatForm().message.style.borderColor = '#ccc';
                    submit = true;
                }

                submit && this.submitChatForm(this.getChatFormValues().message);
            });
        }

        submitChatForm(message) {
            this.socket.emit('chatMessage', message);
        }

        leaveRoom() {
            const leaveRoomButton = document.getElementById('leave-chat');

            if (leaveRoomButton) {
                leaveRoomButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = '/';
                });
            }
        }

        init() {
            this.connectToSocket();
            this.createRoom();
            this.emitMessage();
            this.sendMessage();
            this.leaveRoom();
            this.getRoomAndUsers();
        }
    };

    const chat = new Chat();

    chat.init();
})(window);