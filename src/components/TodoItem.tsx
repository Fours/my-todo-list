import { FiCheck, FiTrash2 } from 'react-icons/fi'
import type { TodoItem } from '../App'

interface Props {
  item: TodoItem
  onToggle: () => void
  onDelete: () => void
}

export default function TodoItemComponent({ item, onToggle, onDelete }: Props) {
  return (
    <div className="todo-item">
      <button
        className={`todo-checkbox${item.done ? ' done' : ''}`}
        onClick={onToggle}
        title={item.done ? 'Mark as not done' : 'Mark as done'}
      >
        {item.done && <FiCheck size={13} strokeWidth={3} />}
      </button>

      <span className={`todo-text${item.done ? ' done' : ''}`}>
        {item.text}
      </span>

      <button
        className="todo-delete-btn"
        onClick={onDelete}
        title="Delete item"
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  )
}
