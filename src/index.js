const server = require('http').createServer();
const io = require('socket.io')(server);

users = []

io.on('connection', socket => {
    socket.on('user', data => {
        const user = {
            'id': data['id'],
            'name': data['name'],
            'socketId': socket.id,
        }
        exists = users.find(e => e['id'] === user['id'])
        if(!exists){
            users.push(user)
        }else{
            exists['socketId'] = socket.id
        }
        socket.emit('userData', user)
    });

    socket.on('allUsers', data => {
        io.emit('allUsersBack', users)
    })

    socket.on('sendMessage', info => {
        socket.to(info['receiverSocketId']).emit('receiveMessage', info);
    })

    socket.on('disconnect', () => { /* … */ });
});

server.listen(process.env.PORT || 3000, () => console.log('server started on port 3000'));