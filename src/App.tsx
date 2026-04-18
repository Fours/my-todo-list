import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ListDetail from './components/ListDetail'

export interface TodoItem {
  id: string
  text: string
  done: boolean
}

export interface TodoList {
  id: string
  name: string
  items: TodoItem[]
  createdAt: number
}

const STORAGE_KEY = 'todo-lists'

function loadLists(): TodoList[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function App() {
  const [lists, setLists] = useState<TodoList[]>(loadLists)
  const [selectedId, setSelectedId] = useState<string | null>(
    () => loadLists()[0]?.id ?? null
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
  }, [lists])

  function createList(name: string) {
    const newList: TodoList = {
      id: crypto.randomUUID(),
      name,
      items: [],
      createdAt: Date.now(),
    }
    setLists(prev => [...prev, newList])
    setSelectedId(newList.id)
  }

  function deleteList(id: string) {
    setLists(prev => {
      const next = prev.filter(l => l.id !== id)
      if (selectedId === id) {
        setSelectedId(next[0]?.id ?? null)
      }
      return next
    })
  }

  function addItem(listId: string, text: string) {
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, items: [...l.items, { id: crypto.randomUUID(), text, done: false }] }
        : l
    ))
  }

  function toggleItem(listId: string, itemId: string) {
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i) }
        : l
    ))
  }

  function deleteItem(listId: string, itemId: string) {
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, items: l.items.filter(i => i.id !== itemId) }
        : l
    ))
  }

  function renameList(listId: string, name: string) {
    setLists(prev => prev.map(l => l.id === listId ? { ...l, name } : l))
  }

  function editItem(listId: string, itemId: string, text: string) {
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, text } : i) }
        : l
    ))
  }

  function reorderItems(listId: string, newItems: TodoItem[]) {
    setLists(prev => prev.map(l => l.id === listId ? { ...l, items: newItems } : l))
  }

  const selectedList = lists.find(l => l.id === selectedId) ?? null

  return (
    <div className="app-shell">
      <Sidebar
        lists={lists}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreate={createList}
        onDelete={deleteList}
      />
      <main className="main-panel">
        {selectedList ? (
          <ListDetail
            list={selectedList}
            onAddItem={(text) => addItem(selectedList.id, text)}
            onToggleItem={(itemId) => toggleItem(selectedList.id, itemId)}
            onDeleteItem={(itemId) => deleteItem(selectedList.id, itemId)}
            onRenameList={(name) => renameList(selectedList.id, name)}
            onEditItem={(itemId, text) => editItem(selectedList.id, itemId, text)}
            onReorderItems={(newItems) => reorderItems(selectedList.id, newItems)}
          />
        ) : (
          <div className="empty-state">
            <p>Create a new list to get started.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
