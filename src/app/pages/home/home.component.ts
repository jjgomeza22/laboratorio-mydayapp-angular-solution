import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Todo } from 'src/app/core/interfaces/todo.interface';

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

  public newTodo = new FormControl();

  public todos: Todo[] = [
    {
      id: '0',
      title: 'comer',
      completed: false,
      isEditingMode: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
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
  }

  clearCompletedTodos() {
    this.todos = this.todos.filter(todo => !todo.completed);
  }

}
