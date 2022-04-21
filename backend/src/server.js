const express = require('express');
const mongoose = require('mongoose');
const cors =  require('cors');

const routes =  require('./routes');

const app = express();
// extraindo o protocolo http express
const server =require('http').Server(app);

//mesclando os protocolos http/Websockets
const io  = require('socket.io')(server , {
    // nesta versão do socket.io deve ser explicito o CORS p/ conectar o socket
    cors: {
      origin: ["http://localhost:3000","http://192.168.0.103:3333"],
      methods: ["GET", "POST"]
    }
});

//  'id_usuarioConn' : 'id_do_socket'
const connectedUsers = {};

// abrindo uma conexão com webSocket com front-end
io.on('connect', socket =>{
    const {user} = socket.handshake.query;
    
    connectedUsers[ user ]= socket.id;
});

mongoose.connect('*****************************');

// middleware, interceptar req p/ chegar diferente no controller
app.use((req, res, next)=>{
    // criando e passando info para o req
    req.io = io;
    req.connectedUsers = connectedUsers;

    // seguir o fluxo
    next();
});

// use it before all route definitions
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333); 
