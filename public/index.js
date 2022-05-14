;((window) => {
    'use strict';

    class Chat {
        rooms = [
            'HTML',
            'CSS',
            'JavaScript',
            'Front End'
        ];

        constructor() {
            console.info('Welcome to Chat App!');

            this.setRooms();
            this.enterChatRoom();
        }

        setRooms() {
            const list = document.getElementById('room');

            list && this.rooms.map((room) => {
                list.innerHTML += `
                    <option value="${room}">${room}</option>
                `;
            });
        }

        getEnterForm() {
            const form = document.getElementById('enter-form');
            const name = document.getElementById('name');
            const room = document.getElementById('room');

            if (form && name && room) {
                return {
                    form: form,
                    name: name,
                    room: room
                };
            } else {
                console.error('DomContent does not loaded!');
            }
        }

        getEnterFormValues() {
            return {
                name: this.getEnterForm().name.value !== '' ? this.getEnterForm().name.value : false,
                room: this.getEnterForm().room.value !== '' ? this.getEnterForm().room.value : false,
            };
        }

        enterChatRoom() {
            this.getEnterForm().form.addEventListener('submit', (e) => {
                e.preventDefault();

                let submit = false;

                if (!this.getEnterFormValues().name) {
                    this.getEnterForm().name.style.borderColor = 'darkred';
                    submit = false;
                } else {
                    this.getEnterForm().name.style.borderColor = '#ccc';
                    submit = true;
                }

                submit && this.submitEnterForm(
                    this.getEnterFormValues().name,
                    this.getEnterFormValues().room
                );
            });
        }

        submitEnterForm(name, room) {
            window.location.href = `/chat.html?name=${name}&room=${room}`;
        }
    };

    new Chat();
})(window);