/**
 * socket listeners (on): sendCanvas
 * socket executors (emit): addCanvas, error
 */
module.exports = {
    init: function(socket, d) { // socket is this user's socket, d is server data
        socket.on('sendCanvas', (data) => {
            try {
                if (d.users[socket.id].session === undefined) { socket.emit('err', {type: 'canvas', msg: 'user not in session'}); return; }
                if (d.users[socket.id].course == null) { socket.emit('err', {type: 'canvas', msg: 'user data missing'}); return; }
                if (d.users[d.users[socket.id].partner] == null) { socket.emit('err', {type: 'tasks', msg: 'partner disconnected'}); return; }

                var entry = {time: (new Date().getTime()), data: data, name: d.users[socket.id].data.name};
                d.users[socket.id].session.canvas.history.push(entry);
                d.users[d.users[socket.id].partner].socket.emit('addCanvas', entry);
            } catch (e) {
                console.log(e.msg == null ? e : e.msg);
            }
        });
    }
};