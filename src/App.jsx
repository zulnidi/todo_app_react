import React from "react";

function TodoItem({ text }) {
  return (
    <li className="todo-item">
      <span>{text}</span>
    </li>
  );
}

export default function App() {
  const todos = [
    "Aprender React",
    "Practicar con Vite",
    "Construir proyectos increíbles",
  ];

  return (
    <div className="page">
      <header className="hero">
        <h1 className="title">¡Bienvenido a mi aplicación de React!</h1>
        <h2 className="subtitle">Lista de cosas por hacer:</h2>
      </header>

      <main className="content">
        <ul className="todo-list">
          {todos.map((t, i) => (
            <TodoItem key={i} text={t} />
          ))}
        </ul>
      </main>
    </div>
  );
}
