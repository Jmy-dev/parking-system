import * as dotenv from 'dotenv'


dotenv.config()

import {config} from './config'

import app from './server'
import {Server} from 'socket.io'
import { createServer } from 'node:http';

const server = createServer(app)

const io = new Server(server ,{})
app.set('socketio',io);

io.on('connection' , (socket) => {
    console.log(`user is connected on :${socket.id} `)

    socket.on('disconnect' , () => {
        console.log(`disconnected :${socket.id}`)
    })
})



server.listen(config.port , () => {
    console.log(` Hello on http://localhost:${config.port}`)
})