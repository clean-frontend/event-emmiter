document.addEventListener("DOMContentLoaded", loadTodos);

function addTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();

  if (text !== "") {
    const todo = {
      text: text,
      completed: false,
    };

    addTodoToList(todo);
    saveTodos();
    input.value = "";
  }
}

function addTodoToList(todo) {
  const list = document.getElementById("todoList");
  const li = document.createElement("li");
  li.className = "todoItem" + (todo.completed ? " completed" : "");

  li.innerHTML = `
                <span>${todo.text}</span>
                <button class="deleteBtn" onclick="deleteTodo(this)">Delete</button>
            `;

  li.querySelector("span").addEventListener("click", function () {
    this.parentElement.classList.toggle("completed");
    saveTodos();
  });

  list.appendChild(li);
}

function deleteTodo(button) {
  const li = button.parentElement;
  li.remove();
  saveTodos();
}

function saveTodos() {
  const todos = [];
  const items = document.querySelectorAll(".todoItem");

  items.forEach((item) => {
    todos.push({
      text: item.querySelector("span").textContent,
      completed: item.classList.contains("completed"),
    });
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach((todo) => addTodoToList(todo));
}

// Add Enter key support
document.getElementById("todoInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTodo();
  }
});
