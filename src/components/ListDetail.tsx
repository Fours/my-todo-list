import { useState, useRef, useEffect } from 'react'
import { MdEdit, MdCheck, MdClose } from 'react-icons/md'
import TodoItemComponent from './TodoItem'
import type { TodoList } from '../App'

interface Props {
  list: TodoList
  onAddItem: (text: string) => void
  onToggleItem: (itemId: string) => void
  onDeleteItem: (itemId: string) => void
  onRenameList: (name: string) => void
}

export default function ListDetail({ list, onAddItem, onToggleItem, onDeleteItem, onRenameList }: Props) {
  const [text, setText] = useState('')
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      editInputRef.current?.focus()
      editInputRef.current?.select()
    }
  }, [editing])

  function startEdit() {
    setEditName(list.name)
    setEditing(true)
  }

  function commitEdit() {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== list.name) {
      onRenameList(trimmed)
    }
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  function handleAdd() {
    const trimmed = text.trim()
    if (!trimmed) return
    onAddItem(trimmed)
    setText('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAdd()
  }

  const remaining = list.items.filter(i => !i.done).length
  const total = list.items.length

  return (
    <div className="list-detail">
      <div className="list-detail-header">
        {editing ? (
          <div className="list-title-edit">
            <input
              ref={editInputRef}
              className="list-title-input"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={handleEditKeyDown}
            />
            <button className="list-title-action-btn" onClick={commitEdit} aria-label="Save name">
              <MdCheck size={18} />
            </button>
            <button className="list-title-action-btn" onClick={cancelEdit} aria-label="Cancel">
              <MdClose size={18} />
            </button>
          </div>
        ) : (
          <div className="list-title-row">
            <h2 className="list-detail-title">{list.name}</h2>
            <button className="list-edit-btn" onClick={startEdit} aria-label="Edit list name">
              <MdEdit size={18} />
            </button>
          </div>
        )}
        <p className="list-detail-count">
          {total === 0
            ? 'No items yet'
            : `${remaining} of ${total} remaining`}
        </p>
      </div>

      <div className="add-item-form">
        <input
          className="add-item-input"
          placeholder="Add a new item…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-item-btn" onClick={handleAdd}>
          Add
        </button>
      </div>

      <div className="todo-items">
        {list.items.length === 0 ? (
          <p className="todo-empty">Add your first item above.</p>
        ) : (
          list.items.map(item => (
            <TodoItemComponent
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
