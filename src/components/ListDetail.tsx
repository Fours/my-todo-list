import { useState } from 'react'
import TodoItemComponent from './TodoItem'
import type { TodoList } from '../App'

interface Props {
  list: TodoList
  onAddItem: (text: string) => void
  onToggleItem: (itemId: string) => void
  onDeleteItem: (itemId: string) => void
}

export default function ListDetail({ list, onAddItem, onToggleItem, onDeleteItem }: Props) {
  const [text, setText] = useState('')

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
        <h2 className="list-detail-title">{list.name}</h2>
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
