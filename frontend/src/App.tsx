import { useEffect, useState } from "react";
import { api } from "./api";

interface Todo {
  id: number;
  title: string;
  completed: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const loadTodos = async () => {
    const res = await api.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;
    await api.post("/todos", { title });
    setTitle("");
    loadTodos();
  };

  const toggleTodo = async (todo: Todo) => {
    await api.put(`/todos/${todo.id}`, {
      completed: todo.completed ? 0 : 1,
    });
    loadTodos();
  };

  const deleteTodo = async (id: number) => {
    await api.delete(`/todos/${id}`);
    loadTodos();
  };

  const startEdit = (todo: Todo) => {
    setEditId(todo.id);
    setEditText(todo.title);
  };

  const saveEdit = async (id: number) => {
    if (!editText.trim()) return;
    await api.put(`/todos/${id}`, { title: editText });
    setEditId(null);
    setEditText("");
    loadTodos();
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="card shadow-sm">
            <div className="card-body">

              <h3 className="text-center mb-4">Todo App</h3>

              {/* Add Todo */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter todo..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addTodo}>
                  Add
                </button>
              </div>

              {/* Todo List */}
              <ul className="list-group">
                {todos.map((t) => (
                  <li
                    key={t.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {editId === t.id ? (
                      <input
                        className="form-control me-2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                    ) : (
                      <span
                        style={{
                          textDecoration: t.completed ? "line-through" : "none",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleTodo(t)}
                      >
                        {t.title}
                      </span>
                    )}

                    <div className="btn-group">
                      {editId === t.id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => saveEdit(t.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => startEdit(t)}
                        >
                          Edit
                        </button>
                      )}

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteTodo(t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
