require('dotenv').config();
const express = require( 'express' );
const io = require( 'socket.io' )();
const PORT = process.env.PORT || 80;
const { handleConnection, handleChatMessage, handleJoinRoom, handleDisconnect } = require( './event-handlers' );


// init the express server
const app = express();

app.get( '/', ( req, res ) => {
    res.send( 'It Works!' );
});


// listen to incoming HTTP connections
const server = app.listen( PORT, () => {

    console.log( `Express server is running on port ${ PORT }...` );

});


// attach the socket.io server to the express server
io.listen( server );


// handle new socket connection
io.on( 'connection', socket => {

    handleConnection( socket );

    // on user join to room
    socket.on( 'join-room', ( data ) => { handleJoinRoom( socket, data ) } );

    // on new chat message from user
    socket.on( 'chat-message', ( message ) => { handleChatMessage( socket, message ); } );

    // on user disconnect
    socket.on( 'disconnect', () => { handleDisconnect( socket ); } );

});


// export socket io server
exports.io = io;