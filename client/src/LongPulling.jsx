import { useEffect, useState } from 'react'
import axios from 'axios'

export const LongPulling = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    subscribe()
  }, [])

  const subscribe = async () => {
    try {
      const { data } = await axios.get('http://localhost:9000/get-messages')
      setMessages((prev) => [data, ...prev])
      await subscribe()
    } catch (e) {
      setTimeout(() => {
        subscribe()
      }, 5000)
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
