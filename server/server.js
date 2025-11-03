import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('WebRTC Signaling Server is running.\n')
})

const io = new Server(httpServer, { cors: { origin: '*' } })

io.on('connection', socket => {
  console.log('Client connected:', socket.id)

  socket.on('offer', data => socket.broadcast.emit('offer', data))
  socket.on('answer', data => socket.broadcast.emit('answer', data))
  socket.on('ice-candidate', data => socket.broadcast.emit('ice-candidate', data))
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
})

httpServer.listen(4000, () => console.log('Signaling server on port 4000'))
