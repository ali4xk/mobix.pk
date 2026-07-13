import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './Messages.css'

export default function Messages() {
  const { listingId, userId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchConversations()
  }, [user])

  useEffect(() => {
    if (listingId && userId) fetchThread()
  }, [listingId, userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const token = () => localStorage.getItem('mobix_token')

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const res = await axios.get('https://mobixpk-production.up.railway.app/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token()}` }
      })
      setConversations(res.data.conversations)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchThread = async () => {
    try {
      const res = await axios.get(`https://mobixpk-production.up.railway.app/api/messages/${listingId}/${userId}`, {
        headers: { Authorization: `Bearer ${token()}` }
      })
      setMessages(res.data.messages)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setSending(true)
    try {
      await axios.post('https://mobixpk-production.up.railway.app/api/messages', {
        receiver_id: parseInt(userId),
        listing_id: parseInt(listingId),
        content: newMessage.trim()
      }, { headers: { Authorization: `Bearer ${token()}` } })
      setNewMessage('')
      fetchThread()
      fetchConversations()
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dt) => {
    const d = new Date(dt)
    return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dt) => {
    const d = new Date(dt)
    return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
  }

  if (!user) return null

  return (
    <div className="messages-page">
      <div className="messages-inner">
        <aside className="conversations-panel">
          <div className="conversations-header">
            <h2 className="conversations-title">Messages</h2>
          </div>

          {loading ? (
            <div className="conv-loading"><i className="ti ti-loader-2 spin" /></div>
          ) : conversations.length === 0 ? (
            <div className="conv-empty">
              <i className="ti ti-message-off" />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map(conv => (
              <Link
                key={`${conv.listing_id}-${conv.other_user_id}`}
                to={`/messages/${conv.listing_id}/${conv.other_user_id}`}
                className={`conv-item ${listingId == conv.listing_id && userId == conv.other_user_id ? 'active' : ''}`}
              >
                <div className="conv-avatar">
                  {conv.other_user_name?.charAt(0).toUpperCase()}
                </div>
                <div className="conv-info">
                  <div className="conv-name">{conv.other_user_name}</div>
                  <div className="conv-listing">{conv.listing_title}</div>
                  <div className="conv-last">{conv.last_message}</div>
                </div>
                <div className="conv-time">{formatDate(conv.created_at)}</div>
              </Link>
            ))
          )}
        </aside>

        <main className="thread-panel">
          {!listingId ? (
            <div className="thread-empty">
              <i className="ti ti-message" />
              <p>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              <div className="thread-header">
                <div className="thread-header-info">
                  <div className="thread-avatar">
                    {conversations.find(c => c.listing_id == listingId && c.other_user_id == userId)?.other_user_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="thread-name">
                      {conversations.find(c => c.listing_id == listingId && c.other_user_id == userId)?.other_user_name || 'User'}
                    </div>
                    <div className="thread-listing">
                      {conversations.find(c => c.listing_id == listingId && c.other_user_id == userId)?.listing_title || `Listing #${listingId}`}
                    </div>
                  </div>
                </div>
                <Link to={`/listing/${listingId}`} className="thread-view-listing">
                  <i className="ti ti-external-link" /> View listing
                </Link>
              </div>

              <div className="thread-messages">
                {messages.length === 0 ? (
                  <div className="thread-empty-msg">
                    <p>No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`message-bubble ${String(msg.sender_id) === String(user.id) ? 'sent' : 'received'}`}>
                      <div className="bubble-content">{msg.content}</div>
                      <div className="bubble-time">{formatTime(msg.created_at)}</div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              <form className="thread-input" onSubmit={handleSend}>
                <input
                  className="message-input"
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <button className="send-btn" type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? <i className="ti ti-loader-2 spin" /> : <i className="ti ti-send" />}
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  )
}