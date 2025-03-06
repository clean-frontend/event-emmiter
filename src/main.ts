import "./style.css";

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

type Sort = {
  text: "ask" | "desc" | "none";
};

class Store {
  public todoList: TodoItem[] = [];
  public sort: Sort = {
    text: "none",
  };

  get sortedTodos() {
    return [...this.todoList].sort((a, b) => {
      switch (this.sort.text) {
        case "ask":
          return a.text.localeCompare(b.text);
        case "desc":
          return b.text.localeCompare(a.text);
        default:
          return 0;
      }
    });
  }

  addTodo(text: string) {
    this.todoList.push({
      id: crypto.randomUUID(),
      text: text,
      completed: false,
    });

    counterView.renderCounter();
    todoView.renderTodoList();
  }

  removeTodo(id: string) {
    this.todoList = this.todoList.filter((todo) => todo.id !== id);

    counterView.renderCounter();
    todoView.renderTodoList();
  }

  updateSort(sort: Sort) {
    this.sort = sort;

    counterView.renderCounter();
    todoView.renderTodoList();
  }
}

const store = new Store();

class CounterView {
  constructor() {
    this.renderCounter();
  }
  renderCounter() {
    const counterContainer = document.getElementById("counter")!;

    counterContainer.innerHTML = `count is ${store.todoList.length}`;
  }
}
const counterView = new CounterView();

class TodoView {
  private todoContainer: HTMLDivElement;

  constructor() {
    this.todoContainer = document.querySelector(".todo-list") as HTMLDivElement;
    const input = this.todoContainer.querySelector(
      "#todoInput"
    ) as HTMLInputElement;
    const button = this.todoContainer.querySelector(
      "#addButton"
    ) as HTMLButtonElement;

    button.addEventListener("click", () => {
      const text = input.value.trim();
      if (text !== "") {
        console.log(store, "store");
        store.addTodo(text);
        input.value = "";
      }
    });

    this.todoContainer.addEventListener("click", (e) => {
      if (
        e.target instanceof HTMLButtonElement &&
        e.target.classList.contains("deleteBtn")
      ) {
        const id = e.target.dataset.id!;
        store.removeTodo(id);
      }
    });
  }

  renderTodoList() {
    const todoListContainer = this.todoContainer.querySelector(".list")!;

    const renderTodo = (todo: TodoItem) => `
      <div>
        <span>${todo.text}</span>
        <button class="deleteBtn" data-id="${todo.id}">Delete</button>
      </div>
    `;

    todoListContainer.innerHTML = store.sortedTodos.map(renderTodo).join("\n");
  }
}
const todoView = new TodoView();

class SortView {
  private sortContainer: HTMLDivElement;

  constructor() {
    this.sortContainer = document.getElementById("sort") as HTMLDivElement;

    this.sortContainer
      .querySelector("#sortSelect")!
      .addEventListener("change", (e) => {
        console.log(e);
        const text = (e.target as HTMLSelectElement).value as Sort["text"];
        store.updateSort({ text: text });
      });
  }
}

new SortView();
