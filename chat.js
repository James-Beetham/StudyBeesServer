/**
 * socket listeners (on): 
 * socket executors (emit): 
 */
module.exports = {
    init: function(socket, d) { // socket is this user's socket, d is server data
        socket.on('sendMessage', (data) => {
            if (typeof data !== 'string') {
                socket.emit('error', {type: 'chat', msg: 'invalid data type: ' + (typeof data)});
            } else {
                var entry = {time: (new Date().getTime()), msg: data};
                d.users[socket.id].session.chat.history.push(entry);
                d.users[d.users[socket.id].partner].socket.emit('addMessage', entry);
            }
        });
    }
};