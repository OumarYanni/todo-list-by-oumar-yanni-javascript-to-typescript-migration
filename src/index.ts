import "./style/style.css";
import { Todo } from "./interfaces/todo.interface";

const ul: HTMLUListElement = document.querySelector("ul")!;
const form: HTMLFormElement = document.querySelector("form")!;
const input: HTMLInputElement =
  document.querySelector<HTMLInputElement>("form > input")!;

form.addEventListener("submit", (event: Event): void => {
  event.preventDefault();
  const value = input.value;
  input.value = "";
  addTodo(value);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && todos.find((t) => t.editMode)) {
    // todos.find((t) => t.editMode).editMode = false;
    // displayTodo();

    const todo = todos.find((t) => t.editMode);
    if (todo) {
      todo.editMode = false;
      displayTodo();
    }
  }
});

const todos: Todo[] = [
  {
    text: "Je suis une todo",
    done: false,
    editMode: true,
  },
  {
    text: "Faire X,Y tâche",
    done: true,
    editMode: false,
  },
];

const displayTodo = () => {
  const todosNode: HTMLLIElement[] = todos.map((todo: Todo, index: number) => {
    if (todo.editMode) {
      return createTodoEditElement(todo, index);
    } else {
      return createTodoElement(todo, index);
    }
  });

  ul.innerHTML = "";
  ul.append(...todosNode);
};

const createTodoElement = (todo: Todo, index: number): HTMLLIElement => {
  const li: HTMLLIElement = document.createElement("li");
  const buttonDelete: HTMLButtonElement = document.createElement("button");
  buttonDelete.innerHTML = "Supprimer";
  buttonDelete.classList.add("danger");
  const buttonEdit: HTMLButtonElement = document.createElement("button");
  buttonEdit.innerHTML = "Edit";
  buttonEdit.classList.add("primary");
  buttonDelete.addEventListener("click", (event: MouseEvent) => {
    event.stopPropagation();
    deleteTodo(index);
  });
  buttonEdit.addEventListener("click", (event: MouseEvent) => {
    event.stopPropagation();
    toggleEditMode(index);
  });
  li.innerHTML = `
    <span class="todo ${todo.done ? "done" : ""}"></span>
    <p class="${todo.done ? "done" : ""}">${todo.text}</p>
  `;
  let timer: number;
  li.addEventListener("click", (event) => {
    if (event.detail === 1) {
      timer = setTimeout(() => {
        toggleTodo(index);
      }, 200);
    } else if (event.detail > 1) {
      clearTimeout(timer);
      toggleEditMode(index);
    }
  });
  li.append(buttonEdit, buttonDelete);
  return li;
};

const createTodoEditElement = (todo: Todo, index: number) => {
  const li: HTMLLIElement = document.createElement("li");
  const input: HTMLInputElement = document.createElement("input");
  input.type = "text";
  input.value = todo.text;
  input.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      editTodo(index, input);
    }
  });
  const buttonSave: HTMLButtonElement = document.createElement("button");
  buttonSave.innerHTML = "Save";
  buttonSave.classList.add("success");
  const buttonCancel: HTMLButtonElement = document.createElement("button");
  buttonCancel.innerHTML = "Cancel";
  buttonCancel.classList.add("danger");
  buttonCancel.addEventListener("click", (event: MouseEvent) => {
    event.stopPropagation();
    toggleEditMode(index);
  });
  buttonSave.addEventListener("click", () => {
    editTodo(index, input);
  });
  li.append(input, buttonSave, buttonCancel);
  setTimeout(() => input.focus(), 0);
  return li;
};

const addTodo = (text: string): void => {
  text = text.trim();
  if (text) {
    todos.push({
      text: `${text[0].toUpperCase()}${text.slice(1)}`,
      done: false,
      editMode: false,
    });
    displayTodo();
  }
};

const deleteTodo = (index: number): void => {
  todos.splice(index, 1);
  displayTodo();
};

const toggleTodo = (index: number): void => {
  todos[index].done = !todos[index].done;
  displayTodo();
};

const toggleEditMode = (index: number): void => {
  todos[index].editMode = !todos[index].editMode;
  displayTodo();
};

const editTodo = (index: number, input: HTMLInputElement): void => {
  const value = input.value;
  todos[index].text = value;
  todos[index].editMode = false;
  displayTodo();
};

displayTodo();
