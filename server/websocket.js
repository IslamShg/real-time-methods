const ws = require('ws')

const wss = new ws.Server(
  {
    port: 9000
  },
  () => console.log('1239')
)

// подключение к сокету
wss.on('connection', function connection(ws) {
  // ws - событие в сокете (от какого-то конкретного клиента)
  ws.on('message', function (message) {
    message = JSON.parse(message)
    switch (message.event) {
      case 'message':
        broadcastMessage(message)
        break
      case 'connection':
        broadcastMessage(message)
        break
    }
  })
})

function broadcastMessage(message) {
  wss.clients.forEach((client) => client.send(JSON.stringify(message)))
}
