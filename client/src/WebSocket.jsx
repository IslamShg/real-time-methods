import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRef } from 'react'

export const WebSocketComponent = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  const [connected, setConnected] = useState(false)
  const [username, setUsername] = useState('')
  const socket = useRef()

  useEffect(() => {}, [])

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:9000')

    socket.current.onopen = () => {
      setConnected(true)
      console.log('Connection opened')
      const message = {
        event: 'connection',
        username,
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message))
    }
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages((prev) => [message, ...prev])
    }
    socket.current.onclose = () => {
      console.log('Socket closed')
    }
    socket.current.onerror = () => {
      console.log('Socket error')
    }
  }

  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message'
    }

    socket.current.send(JSON.stringify(message))
    setValue('')
  }

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            type="text"
            placeholder="Введите ваше имя"
          />
          <button onClick={connect}>Войти</button>
        </div>
      </div>
    )
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
            <div key={msg.id}>
              {msg.event === 'connection' ? (
                <div className="connection_message">
                  Пользователь {msg.username} присоединился
                </div>
              ) : (
                <div className="message">
                  {msg.username}. {msg.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
