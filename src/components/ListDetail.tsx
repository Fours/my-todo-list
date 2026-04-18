import { useState, useRef, useEffect } from 'react'
import { MdEdit, MdCheck, MdClose } from 'react-icons/md'
import { DndContext, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TodoItemComponent from './TodoItem'
import type { TodoItem, TodoList } from '../App'

interface Props {
  list: TodoList
  onAddItem: (text: string) => void
  onToggleItem: (itemId: string) => void
  onDeleteItem: (itemId: string) => void
  onRenameList: (name: string) => void
  onEditItem: (itemId: string, text: string) => void
  onReorderItems: (newItems: TodoItem[]) => void
}

interface SortableItemProps {
  item: TodoItem
  onToggle: () => void
  onDelete: () => void
  onEdit: (text: string) => void
}

function SortableTodoItem({ item, onToggle, onDelete, onEdit }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  return (
    <div ref={setNodeRef} style={style}>
      <TodoItemComponent
        item={item}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        dragHandleListeners={listeners}
        dragHandleAttributes={attributes}
      />
    </div>
  )
}

export default function ListDetail({ list, onAddItem, onToggleItem, onDeleteItem, onRenameList, onEditItem, onReorderItems }: Props) {
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = list.items.findIndex(i => i.id === active.id)
    const newIndex = list.items.findIndex(i => i.id === over.id)
    onReorderItems(arrayMove(list.items, oldIndex, newIndex))
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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={list.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {list.items.map(item => (
                <SortableTodoItem
                  key={item.id}
                  item={item}
                  onToggle={() => onToggleItem(item.id)}
                  onDelete={() => onDeleteItem(item.id)}
                  onEdit={(text) => onEditItem(item.id, text)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
