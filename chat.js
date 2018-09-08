/**
 * socket listeners (on): sendMessage
 * socket executors (emit): addMessage, error
 */
module.exports = {
    init: function(socket, d) { // socket is this user's socket, d is server data
        socket.on('sendMessage', (data) => {
            if (typeof data !== 'string') { socket.emit('err', {type: 'chat', msg: 'invalid data type: ' + (typeof data)}); return; }
            if (d.users[socket.id].session === undefined) { socket.emit('err', {type: 'chat', msg: 'user not in session'}); return; }
            if (d.users[socket.id].course == null) { socket.emit('err', {type: 'chat', msg: 'user data missing'}); return; }
            var entry = {time: (new Date().getTime()), msg: data, name: d.users[socket.id].data.name};
            d.users[socket.id].session.chat.history.push(entry);
            d.users[d.users[socket.id].partner].socket.emit('addMessage', entry);
        });
    }
};