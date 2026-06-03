// 로컬스토리지에서 데이터 불러오기
let todos = JSON.parse(localStorage.getItem("my_todos")) || [];

// 현재 필터 상태 및 선택된 날짜
let currentFilter = "all";
let selectedDate = new Date();

// 해당 주차의 월요일을 구하는 헬퍼 함수
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  // 일요일(0)인 경우 -6일, 그 외는 (1-day)일 만큼 조정하여 월요일 획득
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// 달력에 표시할 기준이 되는 '해당 주의 월요일'
let currentWeekStart = getMonday(new Date());

// DOM 요소 선택
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const monthDisplay = document.getElementById("month-display");
const weekDaysContainer = document.getElementById("week-days");
const prevWeekBtn = document.getElementById("prev-week-btn");
const nextWeekBtn = document.getElementById("next-week-btn");

// 데이터 로컬스토리지 저장
function saveTodos() {
  localStorage.setItem("my_todos", JSON.stringify(todos));
}

// 날짜를 YYYY-MM-DD 포맷의 문자열로 변환
function formatDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 특정 날짜의 Todo 개수를 계산하는 함수
function getTodoCount(dateStr) {
  return todos.filter((todo) => todo.date === dateStr).length;
}

// 주간 뷰(달력)를 렌더링하는 함수
function renderWeekCalendar() {
  // 1. 상단 월 표시 업데이트
  const year = currentWeekStart.getFullYear();
  const month = currentWeekStart.getMonth() + 1;
  monthDisplay.textContent = `${year}년 ${month}월`;

  // 2. 가로 달력 내용 초기화
  weekDaysContainer.innerHTML = "";

  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
  const todayStr = formatDateString(new Date());
  const selectedStr = formatDateString(selectedDate);

  // 3. 월요일부터 일요일까지 7일치 카드 생성
  for (let i = 0; i < 7; i++) {
    // 현재 주의 월요일을 기준으로 i일씩 더해서 날짜 계산
    const currentDay = new Date(currentWeekStart);
    currentDay.setDate(currentWeekStart.getDate() + i);

    const currentDayStr = formatDateString(currentDay);
    const count = getTodoCount(currentDayStr);

    const dayCard = document.createElement("div");
    dayCard.className = "day-card";

    // 오늘 날짜 및 선택된 날짜에 대한 스타일 클래스 추가
    if (currentDayStr === selectedStr) dayCard.classList.add("selected");
    if (currentDayStr === todayStr) dayCard.classList.add("today");

    // 내부 HTML 구조 구성 (요일, 일, 갯수 뱃지)
    dayCard.innerHTML = `
            <span class="day-name">${dayNames[i]}</span>
            <span class="day-number">${currentDay.getDate()}</span>
            <span class="todo-count">${count}</span>
        `;

    // 날짜 카드를 클릭하면 해당 날짜로 선택 변경
    dayCard.addEventListener("click", () => {
      selectedDate = new Date(currentDay);
      renderWeekCalendar(); // 달력 선택 표시 업데이트
      renderTodos(); // 아래 할 일 목록 업데이트
    });

    weekDaysContainer.appendChild(dayCard);
  }
}

// Todo 생성
function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
    date: formatDateString(selectedDate),
  };
  todos.push(newTodo);
  saveTodos();
  renderTodos();
  renderWeekCalendar(); // Todo 개수가 늘어났으니 달력도 다시 그림
}

// Todo 목록 렌더링
function renderTodos() {
  todoList.innerHTML = "";

  const targetDateStr = formatDateString(selectedDate);

  const filteredTodos = todos.filter((todo) => {
    // 1. 선택된 날짜와 맞는지 검사
    if (todo.date !== targetDateStr) return false;

    // 2. 탭 필터링 조건 검사
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.text;

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    const completeBtn = document.createElement("button");
    completeBtn.className = "todo-btn complete-btn";
    completeBtn.textContent = todo.completed ? "취소" : "완료";
    completeBtn.addEventListener("click", () => toggleComplete(todo.id));

    const editBtn = document.createElement("button");
    editBtn.className = "todo-btn edit-btn";
    editBtn.textContent = "수정";
    editBtn.addEventListener("click", () => enableEditMode(todo.id, textSpan));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "todo-btn delete-btn";
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    btnGroup.appendChild(completeBtn);
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    li.appendChild(textSpan);
    li.appendChild(btnGroup);

    todoList.appendChild(li);
  });
}

// Todo 완료 상태 전환
function toggleComplete(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

// Todo 내용 수정
function enableEditMode(id, textElement) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  if (todo.completed) {
    alert("완료된 할 일은 수정할 수 없습니다.");
    return;
  }

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.className = "edit-input";
  inputElement.value = todo.text;

  const parentLi = textElement.parentElement;
  parentLi.replaceChild(inputElement, textElement);
  inputElement.focus();

  function saveChanges() {
    const updatedText = inputElement.value.trim();
    if (updatedText === "") {
      alert("내용을 입력해주세요.");
      inputElement.focus();
      return;
    }
    todo.text = updatedText;
    saveTodos();
    renderTodos();
  }

  inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveChanges();
  });

  inputElement.addEventListener("blur", () => {
    saveChanges();
  });
}

// Todo 삭제
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
  renderWeekCalendar(); // Todo 개수가 줄어들었으니 달력도 다시 그림
}

// 폼 이벤트 리스너
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (text === "") {
    alert("할 일을 입력해주세요!");
    return;
  }

  addTodo(text);
  todoInput.value = "";
});

// 필터 버튼 클릭 처리
filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    e.target.classList.add("active");

    currentFilter = e.target.dataset.filter;
    renderTodos();
  });
});

// 주간 이동: 이전 주 버튼
prevWeekBtn.addEventListener("click", () => {
  // 현재 주 시작일에서 7일을 빼서 이전 주로 설정
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  renderWeekCalendar();
});

// 주간 이동: 다음 주 버튼
nextWeekBtn.addEventListener("click", () => {
  // 현재 주 시작일에서 7일을 더해서 다음 주로 설정
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  renderWeekCalendar();
});

// 앱 초기화 렌더링
renderWeekCalendar();
renderTodos();
