/**
 * socket listeners (on): getAvailable, connectWith, makeAvailable, makeUnavailable
 * socket executors (emit): availableUsers, error, connectRequest
 */

module.exports = {
    /**
     * init: calls when a user connects to the server.
     *   socket - this user's socket
     *   d - data for the server {users, available}
     */
    init: function(socket, d) {
        // add user to users
        d.users[socket.id] = {socket: socket, studyingWith: null, session: null, partner: null, email: 'add email later'};
        // TODO get email from db

        // get available users
        socket.on('getAvailable', (data) => {
            // TODO - search available users?
            socket.emit('availableUsers', {msg: 'insert data here'})
        });
        // connect / confirm connection with user 
        socket.on('connectWith', (data) => { // data is string email address
            if (d.available[data] === undefined) {
                socket.emit('error', {type: 'connect', msg: 'email ' + data + ' is not an available user.'})
            } else {
                if (d.available[data].request == null) { // see if user wants to join
                    d.users[d.available[data]].socket.emit('connectRequest', d.users[socket.id].email);
                } else if (d.available[data].request == d.users[socket.id].email) { // successfully confirmed joining
                    var clientOne = d.users[d.available[data].id];
                    var clientTwo = d.users[socket.id];
                    clientOne.partner = clientTwo.socket.id;
                    clientTwo.partner = clientOne.socket.id;
                    d.available[data] = undefined;
                    d.available[d.users[socket.id].email] = undefined;
                    var session = {chat: {history: []}, editor: {history: []}, canvas: {history: []}, tasks: {history: []}, users: [clientOne, clientTwo]};
                    clientOne.session = session;
                    clientTwo.session = session;
                } else {
                    socket.emit('error', {type: 'connect', msg: 'user is waiting for someone else'});
                }
            }
            console.log(socket.id + ' sent connect request');
        });
        // makes user available (other users can search and connect with them)
        socket.on('makeAvailable', () => {
            if (d.users[socket.id].session != null) {
                console.log('[error ' + socket.id + '] user tried to become available while in session');
            } else {
                d.available[d.users[socket.id].email] = {id: socket.id, request: null};
            }
        });
        socket.on('makeUnavailable', () => {
            if (d.available[d.users[socket.id].email] === undefined) {
                console.log('[error ' + socket.id + '] user tried to become unavailable while not available');
            } else {
                d.available[d.users[socket.id].email] = undefined;
            }
        });
    }
};