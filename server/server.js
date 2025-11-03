import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.on('offer', data => socket.broadcast.emit('offer', data))
  socket.on('answer', data => socket.broadcast.emit('answer', data))
  socket.on('ice-candidate', data => socket.broadcast.emit('ice-candidate', data))
})

httpServer.listen(4000, () => console.log('Signaling server on 4000'))
