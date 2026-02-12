import { useState, useRef, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { FiSend, FiHash, FiUser } from 'react-icons/fi'
import { format } from 'date-fns'

const channels = ['general', 'deliveries', 'store', 'announcements']

export default function StaffChat() {
  const { currentUser, messages, sendMessage, staff } = useStore()
  const [activeChannel, setActiveChannel] = useState('general')
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const channelMessages = messages.filter(m => m.channel === activeChannel)
    .sort((a, b) => new Date(a.time) - new Date(b.time))

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [channelMessages.length])

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    sendMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: newMessage.trim(),
      channel: activeChannel,
    })
    setNewMessage('')
  }

  const onlineStaff = staff.filter(s => s.clockedIn)

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-12rem)]">
      {/* Channels & Members Sidebar */}
      <div className="lg:w-64 shrink-0 flex flex-row lg:flex-col gap-4">
        {/* Channels */}
        <div className="glass-card flex-1 lg:flex-none">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Channels</h3>
          <div className="space-y-1">
            {channels.map(ch => (
              <button key={ch} onClick={() => setActiveChannel(ch)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  activeChannel === ch
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <FiHash size={14} />
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Online Members */}
        <div className="glass-card flex-1 lg:flex-none hidden lg:block">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Online — {onlineStaff.length}
          </h3>
          <div className="space-y-2">
            {onlineStaff.map(s => (
              <div key={s.id} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-gray-300">{s.name}</span>
              </div>
            ))}
            {staff.filter(s => !s.clockedIn).map(s => (
              <div key={s.id} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-600" />
                <span className="text-sm text-gray-500">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card flex flex-col p-0 min-h-0">
        {/* Channel Header */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <FiHash size={18} className="text-brand-400" />
          <h2 className="font-semibold">{activeChannel}</h2>
          <span className="text-xs text-gray-400 ml-auto">{channelMessages.length} messages</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {channelMessages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-12">
              <FiHash size={32} className="mx-auto mb-3 text-gray-600" />
              <p>No messages in #{activeChannel} yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          ) : (
            channelMessages.map(msg => {
              const isMe = msg.senderId === currentUser.id
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isMe ? 'bg-brand-500/20 text-brand-400' : 'bg-accent-500/20 text-accent-400'
                  }`}>
                    {msg.senderName?.split(' ').map(n => n[0]).join('') || <FiUser size={14} />}
                  </div>
                  <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-xs font-medium ${isMe ? 'text-brand-400' : 'text-accent-400'}`}>
                        {isMe ? 'You' : msg.senderName}
                      </span>
                      <span className="text-xs text-gray-600">
                        {format(new Date(msg.time), 'h:mm a')}
                      </span>
                    </div>
                    <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-brand-500/20 text-white rounded-tr-md'
                        : 'bg-white/5 text-gray-200 rounded-tl-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/5">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={`Message #${activeChannel}...`}
              className="input-field flex-1"
              autoFocus
            />
            <button type="submit" disabled={!newMessage.trim()}
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed">
              <FiSend size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
