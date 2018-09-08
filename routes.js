module.exports = {
    init(app) { // io is socket io, d is server data
        app.get('/', (req, res) => res.send('Hello world'));
    }
};