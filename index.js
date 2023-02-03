const websocketsServerPort = 8000;
const websocketServer = require('websocket').server;
const http = require('http');

// Spinning http socket server and the websocket server
const server = http.createServer();
server.listen(websocketsServerPort);
console.log('listening on port 8000');

const wsServer = new websocketServer({
    httpServer: server
});

const clients = {}

const getUniqueId = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0 * 10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
}

wsServer.on('request', function (request) {
    var userId = getUniqueId();
    console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.');

    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userId] = connection;
    console.log('connected ' + userId + ' in ' + Object.getOwnPropertyNames(clients));
    
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ', message.utf8Data);
    
            // Broadcasting message to all connected clients
            for (keys in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log('sent message to: ', clients[key]);
            };
        }
    })
})
