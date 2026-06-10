
import { useState, useEffect } from "react";


function formatDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export default function TodoApp() {
  
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("my_todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
  const [inputText, setInputText] = useState("");
  
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  
  useEffect(() => {
    localStorage.setItem("my_todos", JSON.stringify(todos));
  }, [todos]);

  
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
  const todayStr = formatDateString(new Date());
  const selectedStr = formatDateString(selectedDate);
  const year = currentWeekStart.getFullYear();
  const month = currentWeekStart.getMonth() + 1;

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const currentDay = new Date(currentWeekStart);
    currentDay.setDate(currentWeekStart.getDate() + i);
    const currentDayStr = formatDateString(currentDay);
    const count = todos.filter((todo) => todo.date === currentDayStr).length;

    return {
      date: currentDay,
      dateStr: currentDayStr,
      dayName: dayNames[i],
      dayNumber: currentDay.getDate(),
      count,
      isToday: currentDayStr === todayStr,
      isSelected: currentDayStr === selectedStr,
    };
  });

  
  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (text === "") {
      alert("할 일을 입력해주세요!");
      return;
    }
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      date: selectedStr,
    };
    setTodos([...todos, newTodo]);
    setInputText("");
  };

  const toggleComplete = (id) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    if (todo.completed) {
      alert("완료된 할 일은 수정할 수 없습니다.");
      return;
    }
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    const updatedText = editText.trim();
    if (updatedText === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, text: updatedText } : todo
    ));
    setEditingId(null);
  };

  
  const filteredTodos = todos.filter((todo) => {
    if (todo.date !== selectedStr) return false;
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <h1>TODO</h1>
      
      {}
      <div className="week-calendar">
        <div className="week-header">
          <button className="nav-btn" onClick={handlePrevWeek}>&lt;</button>
          <span id="month-display">{year}년 {month}월</span>
          <button className="nav-btn" onClick={handleNextWeek}>&gt;</button>
        </div>
        <div className="week-days">
          {weekDays.map((day) => (
            <div
              key={day.dateStr}
              className={`day-card ${day.isSelected ? "selected" : ""} ${day.isToday ? "today" : ""}`}
              onClick={() => setSelectedDate(day.date)}
            >
              <span className="day-name">{day.dayName}</span>
              <span className="day-number">{day.dayNumber}</span>
              <span className="todo-count">{day.count}</span>
            </div>
          ))}
        </div>
      </div>
      
      {}
      <form id="todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          id="todo-input"
          placeholder="오늘 할 일은 무엇인가요?"
          autoComplete="off"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" id="add-btn">추가</button>
      </form>

      {}
      <div className="filter-tabs">
        {["all", "active", "completed"].map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${currentFilter === filter ? "active" : ""}`}
            onClick={() => setCurrentFilter(filter)}
          >
            {filter === "all" ? "전체" : filter === "active" ? "진행 중" : "완료"}
          </button>
        ))}
      </div>
      
      {}
      <ul id="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            {editingId === todo.id ? (
              <input
                type="text"
                className="edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                onBlur={() => saveEdit(todo.id)}
                autoFocus
              />
            ) : (
              <span className="todo-text">{todo.text}</span>
            )}
            <div className="btn-group">
              <button className="todo-btn complete-btn" onClick={() => toggleComplete(todo.id)}>
                {todo.completed ? "취소" : "완료"}
              </button>
              <button className="todo-btn edit-btn" onClick={() => startEdit(todo)}>
                수정
              </button>
              <button className="todo-btn delete-btn" onClick={() => deleteTodo(todo.id)}>
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}