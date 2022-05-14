const users = [];

const joinUser = (id, user, room) => {
    const newUser = {
        id: id,
        user: user,
        room: room
    };

    users.push(newUser);

    return newUser;
};

const leaveUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getCurrentUser = (id) => {
    return users.find((user) => user.id === id);
};

const getRoomUsers = (room) => {
    return users.filter((user) => user.room === room);
};

module.exports = {
    joinUser,
    leaveUser,
    getCurrentUser,
    getRoomUsers
};