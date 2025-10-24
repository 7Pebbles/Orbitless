# Orbitless  
**Decentralized Team Workspace**

Orbitless is a peer-to-peer collaboration platform for small development teams. It combines **messaging channels** and **Kanban boards** in a **local-first** mesh network — no central servers, no vendor lock-in.

---

## 🚀 Features
- **Channel-based messaging** with offline persistence  
- **Kanban boards** for lightweight project management  
- **Peer-to-peer synchronization** using CRDTs (via Yjs or Gun.js)  
- **Local-first data** stored in IndexedDB  
- **Optional relay node** for NAT traversal and WebRTC signaling  
- **End-to-end encryption** for messages  
- Works seamlessly **offline or over LAN/VPN**

---

## 🏗️ Architecture
| Layer | Technology | Description |
|-------|-------------|-------------|
| Frontend | Next.js + Tailwind CSS | UI and routing |
| Sync Layer | Yjs / Gun.js | CRDT-based replication |
| Networking | WebRTC / WebSocket | Peer-to-peer communication |
| Storage | IndexedDB | Local persistence |
| Optional Relay | Node.js / Express | Bootstrap and NAT traversal |

---

