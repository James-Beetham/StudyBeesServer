module.exports = {
    init: function(socket, d) { // socket is this user's socket, d is server data
        socket.on('connect', (data) => {
            console.log(socket.id + ' sent connect request');
        });
    }
};