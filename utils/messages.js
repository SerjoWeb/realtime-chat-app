const moment = require('moment');

const formatMessage = (user, message) => {
    return {
        user: user,
        message: message,
        time: moment().format('h:mm a')
    };
};

module.exports = formatMessage;