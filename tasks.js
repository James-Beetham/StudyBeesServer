/**
 * socket listeners (on): 
 * socket executors (emit): 
 */
module.exports = {
    init: function(socket, d) { // socket is this user's socket, d is server data
        socket.on('sendTask', (data) => {
            try {
                if (d.users[socket.id].session === undefined) { socket.emit('err', {type: 'tasks', msg: 'user not in session'}); return; }
                if (d.users[socket.id].course == null) { socket.emit('err', {type: 'tasks', msg: 'user data missing'}); return; }
                if (d.users[d.users[socket.id].partner] == null) { socket.emit('err', {type: 'tasks', msg: 'partner disconnected'}); return; }

                var entry = {time: (new Date().getTime()), data: data};
                d.users[socket.id].session.tasks.history.push(entry);
                d.users[d.users[socket.id].partner].socket.emit('addTask', entry);
            } catch (e) {
                console.log(e.msg == null ? e : e.msg);
            }
        });
    }
};