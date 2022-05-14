/** require express modules */
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

/** import message format hook */
const formatMessage = require('./utils/messages');

/** import users hook */
const { joinUser, leaveUser, getCurrentUser, getRoomUsers } = require('./utils/users');

/** init express and port */
const app = express();
const PORT = 5050 || process.env.PORT;

/** init a server const (create server) */
const server = http.createServer(app);

/** init socket */
const io = socketio(server);

/** init bot name */
const botName = '☺ ChatLive';

/** set public folder as available and static */
app.use(express.static(path.join(__dirname, 'public')));

/** run whe the client connects */
io.on('connection', (socket) => {
    console.info('New Socket Connection');

    /** join room get user data and room */
    socket.on('createRoom', ({ user, room }) => {
        /** init joined user */
        const joinedUser = joinUser(socket.id, user, room);

        /** join user to room */
        socket.join(joinedUser.room);

        /** emit message to a single client */
        socket.emit('message', formatMessage(botName, `Welcome to ${botName}`));

        /** broadcast emit to all client except who are connected */
        socket.broadcast.to(joinedUser.room).emit('message', formatMessage(botName, `${joinedUser.user} has joined the chat!`));

        /** users and room info */
        io.to(joinedUser.room).emit('roomUsers', {
            room: joinedUser.room,
            users: getRoomUsers(joinedUser.room)
        });
    });

    /** emit a chat message */
    socket.on('chatMessage', (message) => {
        /** get leaving user */
        const currentUser = getCurrentUser(socket.id);
        
        if (currentUser) {
            /** to all clients */
            io.to(currentUser.room).emit('message', formatMessage(currentUser.user, message));
        }
    });

    /** disconect clients */
    socket.on('disconnect', () => {
        /** get leaving user */
        const userLeaving = leaveUser(socket.id);

        if (userLeaving) {
            /** broadcast emit to all client */
            io.to(userLeaving.room).emit('message', formatMessage(botName, `${userLeaving.user} has left the chat!`));

            /** users and room info */
            io.to(userLeaving.room).emit('roomUsers', {
                room: userLeaving.room,
                users: getRoomUsers(userLeaving.room)
            });
        }
    });
});

/** start listening app on port */
server.listen(PORT, () => console.info(`App running on localhost:${PORT}`));