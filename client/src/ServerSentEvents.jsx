import { useEffect, useState } from 'react'
import axios from 'axios'

export const ServerSentEvents = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    subscribe() 
  }, [])

  const subscribe = async () => {
    const eventSource = new EventSource('http://localhost:9000/connect')
    eventSource.onmessage = function (event) {
      // console.log('data: ', event.data)
      const message = JSON.parse(event.data)
      setMessages((prev) => [message, ...prev])
    }
  }

  const sendMessage = async () => {
    await axios.post('http://localhost:9000/new-messages', {
      message: value,
      id: Date.now()
    })
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
          <button onClick={sendMessage}>Отправить</button>
        </div>
        <div className="messages">
          {messages.map((msg) => (
            <div className="message" key={msg.id}>
              {msg.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
