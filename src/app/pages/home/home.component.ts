import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Todo } from 'src/app/core/interfaces/todo.interface';
import { getValueFromLocaStorage, setValueInLocalStorage } from 'src/app/core/utils/localstorage.util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  @ViewChild('todoCreator') input!: ElementRef<HTMLInputElement>;
  @ViewChild('editing') inputEditing!: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown.escape')
  handleEsc() {
    const todoEditing = this.todos.findIndex(todo => todo.isEditingMode);
    this.todos[todoEditing].isEditingMode = false;
  }

  private readonly LOCAL_STORAGE_NAME = 'mydayapp-angular';

  public newTodo = new FormControl();
  public todos: Todo[] = [];

  constructor() { }

  ngOnInit(): void {
    this.todos = getValueFromLocaStorage<Todo[]>(this.LOCAL_STORAGE_NAME, []);
  }

  addNewTodo() {
    if (!!this.newTodo.value) {
      const newTodo: Todo = {
        id: this.todos.length.toString(),
        title: this.newTodo.value.trim(),
        completed: false,
        isEditingMode: false
      };

      this.todos.push(newTodo);
      this.updateLocalStorage();
      this.newTodo.setValue(null);
      this.input.nativeElement.focus();
    }
  }

  handleTodoState(event: Event, todoToChange: Todo) {
    const inputEl = event.target as HTMLInputElement;
    this.todos.forEach(todo => {
        if (todo.id === todoToChange.id) {
          todo.completed = inputEl.checked;
        }
      }
    );
    this.updateLocalStorage();
  }

  updateTitle(event: Event, todoToChange: Todo) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.todos.forEach(todo => {
      if (todo.id === todoToChange.id) {
        todo.title = value;
        todo.isEditingMode= false;
      }
    }
  );
  }

  activateDeactivateEditingMode(todo: Todo, state: boolean) {
    todo.isEditingMode = state;
    this.inputEditing.nativeElement.focus();
  }

  deleteTodo(todoIndex: number) {
    this.todos.splice(todoIndex, 1);
    this.updateLocalStorage();
  }

  clearCompletedTodos() {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.updateLocalStorage();
  }

  private updateLocalStorage(): void {
    setValueInLocalStorage(this.LOCAL_STORAGE_NAME, JSON.stringify(this.todos));
  }
}
