'use client'
import { useState, useRef, useEffect } from 'react'
import io from 'socket.io-client'

export default function OrbitlessChat() {
  const [serverUrl, setServerUrl] = useState('')
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const pc = useRef(null)
  const dataChannel = useRef(null)

  useEffect(() => {
    document.title = 'Orbitless Chat'
  }, [])

  const connectServer = () => {
    const s = io(serverUrl)
    setSocket(s)

    pc.current = new RTCPeerConnection()
    dataChannel.current = pc.current.createDataChannel('chat')
    dataChannel.current.onmessage = e => addMsg('Peer', e.data)

    pc.current.onicecandidate = e => {
      if (e.candidate) s.emit('ice-candidate', e.candidate)
    }
    pc.current.ondatachannel = e => {
      e.channel.onmessage = ev => addMsg('Peer', ev.data)
    }

    s.on('offer', async offer => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await pc.current.createAnswer()
      await pc.current.setLocalDescription(answer)
      s.emit('answer', answer)
      setConnected(true)
    })

    s.on('answer', async answer => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer))
      setConnected(true)
    })

    s.on('ice-candidate', async c => {
      try { await pc.current.addIceCandidate(c) } catch {}
    })
  }

  const startCall = async () => {
    const offer = await pc.current.createOffer()
    await pc.current.setLocalDescription(offer)
    socket.emit('offer', offer)
  }

  const addMsg = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }])
  }

  const sendMsg = () => {
    if (dataChannel.current?.readyState === 'open' && input.trim()) {
      dataChannel.current.send(input)
      addMsg('You', input)
      setInput('')
    }
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: 600, margin: 'auto' }}>
      <h1>Orbitless Chat</h1>

      {!socket && (
        <div>
          <input
            type="text"
            placeholder="Enter signaling server URL"
            value={serverUrl}
            onChange={e => setServerUrl(e.target.value)}
            style={{ width: '80%', padding: '8px' }}
          />
          <button onClick={connectServer} style={{ marginLeft: 8 }}>Connect</button>
        </div>
      )}

      {socket && !connected && (
        <div style={{ marginTop: 20 }}>
          <button onClick={startCall}>Start Chat</button>
          <p>Or wait for another user to start.</p>
        </div>
      )}

      {connected && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            border: '1px solid #ccc',
            height: 300,
            overflowY: 'auto',
            padding: 10,
            marginBottom: 10,
            textAlign: 'left'
          }}>
            {messages.map((m, i) => (
              <p key={i}><strong>{m.sender}:</strong> {m.text}</p>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message"
            style={{ width: '80%', padding: '8px' }}
          />
          <button onClick={sendMsg} style={{ marginLeft: 8 }}>Send</button>
        </div>
      )}
    </div>
  )
}
