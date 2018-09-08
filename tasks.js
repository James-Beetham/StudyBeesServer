/**
 * socket listeners (on): 
 * socket executors (emit): 
 */
module.exports = {
    init: function(socket, d) { // socket is this user's socket, d is server data
        socket.on('addTask', (data) => {
            if (typeof data !== 'string') { socket.emit('err', {type: 'tasks', msg: 'invalid data type: ' + (typeof data)}); return; }
            if (d.users[socket.id].session === undefined) { socket.emit('err', {type: 'tasks', msg: 'user not in session'}); return; }
            if (d.users[socket.id].course == null) { socket.emit('err', {type: 'tasks', msg: 'user data missing'}); return; }

            var entry = {time: (new Date().getTime()), task: data};
            d.users[socket.id].session.tasks.history.push(entry);
            d.users[d.users[socket.id].partner].socket.emit('addMessage', entry);
        });
    }
};