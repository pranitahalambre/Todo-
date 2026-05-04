const cl = console.log;

const todoForm = document.getElementById('todoForm');
const todoItemControl = document.getElementById('todoItem');
const todoList = document.getElementById('todoList');

let isEdit = false;
let editId = null;

let todosArr = [
  { todoItem: "CSS", todoId: "1" },
  { todoItem: "JS & ES6", todoId: "2" },
  { todoItem: "HTML", todoId: "3" }
];



const uuid = () => {
  return String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};



function tempalating(arr) {
  let result = '';

  arr.forEach(obj => {
    result += `
      <li class="list-group-item d-flex justify-content-between" data-id="${obj.todoId}">
        <strong>${obj.todoItem}</strong>
        <div>
          <i class="fa-solid fa-pen-to-square fa-2x text-primary editBtn" role="button"></i>
          <i class="fa-solid fa-trash-can fa-2x text-danger deleteBtn" role="button"></i>
        </div>
      </li>`;
  });

  todoList.innerHTML = result;
}

tempalating(todosArr);


//  Add / Update Todo 
function onTodoSubmit(e) {
  e.preventDefault();

  if (todoItemControl.value.trim() === '') {
    return alert('Please enter todo');
  }

  if (isEdit) {
    let obj = todosArr.find(todo => todo.todoId == editId);

    Swal.fire({
      title: "Are you sure?",
      text: `Update "${obj.todoItem}" to "${todoItemControl.value}" ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!"
    }).then((result) => {

      if (result.isConfirmed) {
        obj.todoItem = todoItemControl.value;

        tempalating(todosArr);

        Swal.fire({
          title: "Updated!",
          text: "Todo updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });

        isEdit = false;
        editId = null;
        todoForm.querySelector('button').textContent = "Add";
        todoForm.reset();
      }

    });

  } else {
    // CREATE
    let newTodo = {
      todoItem: todoItemControl.value,
      todoId: uuid()
    };

    todosArr.push(newTodo);

    tempalating(todosArr);
    todoForm.reset();
  }
}

todoForm.addEventListener('submit', onTodoSubmit);


//  Delete with confirmation
function onRemove(ele) {
  let REMOVE_ID = ele.closest('li').getAttribute('data-id');

  let getIndex = todosArr.findIndex(todo => todo.todoId == REMOVE_ID);
  let removedItem = todosArr[getIndex];

  Swal.fire({
    title: "Are you sure?",
    text: `Delete "${removedItem.todoItem}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {

    if (result.isConfirmed) {
      let removedTodo = todosArr.splice(getIndex, 1);

      tempalating(todosArr);

      Swal.fire({
        title: "Deleted!",
        text: `"${removedTodo[0].todoItem}" removed.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    }

  });
}


//  Edit + Delete Click
todoList.addEventListener('click', function (e) {

  // DELETE
  if (e.target.classList.contains('deleteBtn')) {
    onRemove(e.target);
  }

  // EDIT
  if (e.target.classList.contains('editBtn')) {
    let li = e.target.closest('li');
    let id = li.getAttribute('data-id');

    let obj = todosArr.find(todo => todo.todoId == id);

    todoItemControl.value = obj.todoItem;

    isEdit = true;
    editId = id;

    todoForm.querySelector('button').textContent = "Update";
  }

});