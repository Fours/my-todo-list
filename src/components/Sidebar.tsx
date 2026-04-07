import { useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import type { TodoList } from '../App'

interface Props {
  lists: TodoList[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  onDelete: (id: string) => void
}

export default function Sidebar({ lists, selectedId, onSelect, onCreate, onDelete }: Props) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setName('')
    setCreating(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') {
      setCreating(false)
      setName('')
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">My Lists</h1>
      </div>

      <nav className="sidebar-lists">
        {lists.map(list => {
          const remaining = list.items.filter(i => !i.done).length
          return (
            <div
              key={list.id}
              className={`list-row${list.id === selectedId ? ' active' : ''}`}
              onClick={() => onSelect(list.id)}
            >
              <span className="list-row-name">{list.name}</span>
              {remaining > 0 && (
                <span className="list-row-count">{remaining}</span>
              )}
              <button
                className="delete-list-btn"
                onClick={e => {
                  e.stopPropagation()
                  onDelete(list.id)
                }}
                title="Delete list"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          )
        })}
      </nav>

      <div className="new-list-section">
        {creating ? (
          <div className="new-list-form">
            <input
              autoFocus
              className="new-list-input"
              placeholder="List name…"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="new-list-actions">
              <button className="btn-primary" onClick={handleCreate}>
                Create
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setCreating(false)
                  setName('')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="new-list-btn" onClick={() => setCreating(true)}>
            <FiPlus size={15} />
            New List
          </button>
        )}
      </div>
    </aside>
  )
}
