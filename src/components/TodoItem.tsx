import { useState, useRef, useEffect } from 'react'
import { FiCheck, FiTrash2, FiEdit2, FiX } from 'react-icons/fi'
import type { TodoItem } from '../App'

interface Props {
  item: TodoItem
  onToggle: () => void
  onDelete: () => void
  onEdit: (text: string) => void
}

export default function TodoItemComponent({ item, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function startEdit() {
    setEditText(item.text)
    setEditing(true)
  }

  function commitEdit() {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== item.text) {
      onEdit(trimmed)
    }
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  return (
    <div className="todo-item">
      <button
        className={`todo-checkbox${item.done ? ' done' : ''}`}
        onClick={onToggle}
        title={item.done ? 'Mark as not done' : 'Mark as done'}
        disabled={editing}
      >
        {item.done && <FiCheck size={13} strokeWidth={3} />}
      </button>

      {editing ? (
        <>
          <input
            ref={inputRef}
            className="todo-edit-input"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="todo-action-btn" onClick={commitEdit} title="Save">
            <FiCheck size={14} />
          </button>
          <button className="todo-action-btn" onClick={cancelEdit} title="Cancel">
            <FiX size={14} />
          </button>
        </>
      ) : (
        <>
          <span className={`todo-text${item.done ? ' done' : ''}`}>
            {item.text}
          </span>
          <button
            className="todo-edit-btn"
            onClick={startEdit}
            title="Edit item"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            className="todo-delete-btn"
            onClick={onDelete}
            title="Delete item"
          >
            <FiTrash2 size={14} />
          </button>
        </>
      )}
    </div>
  )
}
