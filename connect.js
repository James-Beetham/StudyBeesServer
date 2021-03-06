/**
 * socket listeners (on): setData, makeAvailable, makeUnavailable
 * socket executors (emit): err, connect
 */

module.exports = {
    /**
     * init: calls when a user connects to the server.
     *   socket - this user's socket
     *   d - data for the server {users, courses}
     */
    init: function(socket, d) {
        // add user to users
        d.users[socket.id] = {socket: socket, session: null, partner: null, course: null, data: null};
        // TODO get email from db

        // socket.on('setData', (data) => { // data: {email, class, school, name} temporary, fix by checking with mongodb
        //     if (typeof data.course !== 'string') {
        //         socket.emit('err', {type: 'connect', msg: 'invalid type for setEmail ' + (typeof data.email)});
        //     } else {
        //         d.users[socket.id].course = data.course;
        //         d.users[socket.id].data = data;
        //     }
        // });

        // get available users
        // socket.on('getInClass', (data) => { // returns hashmap of schools with user's socket ids linked with email
        //     // TODO - search available users?
        //     socket.emit('availableUsersInClass', {d.classes[d.users[socket.id].course]});
        // });
        // connect / confirm connection with user 
        // socket.on('connectWith', (data) => { // data is string email address
        //     if (d.available[data] === undefined) {
        //         socket.emit('error', {type: 'connect', msg: 'email ' + data + ' is not an available user.'})
        //     } else {
        //         if (d.available[data].request == null) { // see if user wants to join
        //             d.users[d.available[data]].socket.emit('connectRequest', d.users[socket.id].email);
        //         } else if (d.available[data].request == d.users[socket.id].email) { // successfully confirmed joining
        //             var clientOne = d.users[d.available[data].id];
        //             var clientTwo = d.users[socket.id];
        //             clientOne.partner = clientTwo.socket.id;
        //             clientTwo.partner = clientOne.socket.id;
        //             d.available[data] = undefined;
        //             d.available[d.users[socket.id].email] = undefined;
        //             var session = {chat: {history: []}, editor: {history: []}, canvas: {history: []}, tasks: {history: []}, users: [clientOne, clientTwo]};
        //             clientOne.session = session;
        //             clientTwo.session = session;
        //         } else {
        //             socket.emit('error', {type: 'connect', msg: 'user is waiting for someone else'});
        //         }
        //     }
        //     console.log(socket.id + ' sent connect request');
        // });
        socket.on('getData', () => { // for dev purposes only!
            socket.emit('dataDump', d);
        });
        // makes user available (other users can search and connect with them)
        socket.on('makeAvailable', (data) => {
            try {
                if (typeof data.course !== 'string') {
                    socket.emit('err', {type: 'connect', msg: 'invalid type for setEmail ' + (typeof data.email)});
                } else {
                    d.users[socket.id].course = data.course;
                    d.users[socket.id].data = data;
                }

                if (d.users[socket.id] == null) { socket.emit('err', {type: 'connect', msg: 'this should not have happend - ask james to fix'}); return; }
                if (d.users[socket.id].session != null) { socket.emit('err', {type: 'connect', msg: 'user is already in a session'}); return; }
                var course = d.users[socket.id].course;

                if (d.courses[course] === undefined) {
                    d.courses[course] = socket.id;
                } else {
                    var partner = d.users[d.courses[course]].socket;
                    d.courses[course] = undefined;
                    var session = {chat: {history: []}, editor: {history: []}, canvas: {history: []}, tasks: {history: []}, users: [partner.id, socket.id]};
                    d.users[socket.id].session = d.users[partner.id].session = session;
                    d.users[partner.id].partner = socket.id;
                    d.users[socket.id].partner = partner.id;
                    console.log('partnered up');
                    partner.emit('connectWithPartner', d.users[socket.id].data);
                    socket.emit('connectWithPartner', d.users[partner.id].data);
                }
            } catch (e) {
                console.log(e.msg == null ? e : e.msg);
            }
        });
        socket.on('makeUnavailable', () => {
            if (d.courses[d.users[socket.id].course] === undefined) {
                socket.emit('err', {type: 'connect', msg: 'user is not currently available'});
            } else {
                d.courses[d.users[socket.id].course] = undefined;
            }
        });
    }
};