import { PlusCircle } from "phosphor-react";
import React, { FormEvent, ReactNode, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./List.module.css";
import ListContent from "./ListContent";
import { ITask } from "../types/iTask";

interface Storage {
  children: ReactNode, 
  storageName: string,
}

export function List({children, storageName}: Storage) {

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>("");

  useEffect(() => {
    const storage = localStorage.getItem("todo-" + storageName)
    let items = localStorage.getItem("todo-" + storageName) !== null ? storage : []
    if(typeof items == "string") {
      setTasks(sortByIsDone(JSON.parse(items)))
    } 
  }, [storageName])

  function setLocalStorage(array:ITask[]) {
    localStorage.setItem("todo-" + storageName, JSON.stringify(array))
  }

  function sortByIsDone(newTasksArray: ITask[]) {
    const newTasksArraySorted = newTasksArray.sort((a, b) => {
      if (a.isDone === false) return -1;
      if (a.isDone === true) return 1;
      return 0;
    });
    return newTasksArraySorted;
  }

  function handleNewCommentInvalid(event: any) {
    event.target.setCustomValidity("This field is mandatory");
  }

  function handleTypeNewTaskText(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.setCustomValidity("");
    setNewTaskText(event.target.value);
  }

  function handleCreateNewTask(event: FormEvent) {
    event.preventDefault();
    const newTask = {
      content: newTaskText,
      id: uuidv4(),
      isDone: false,
      created_at: Date.now()
    };
    const newTasksArray = [...tasks, newTask];

    setTasks(sortByIsDone(newTasksArray));

    setLocalStorage([...tasks, newTask])
    setNewTaskText("");
  }

  function deleteTask(taskId: string) {
    const newTasksArray = tasks.length > 0 ? tasks.filter((task: ITask) => task.id !== taskId) : [];
    localStorage.setItem("todo-" + storageName, JSON.stringify(newTasksArray));
    setTasks(newTasksArray);
  }

  function selectTask(taskId: string) {
    const newTasksArray = tasks.map((task: ITask) => {
      if (task.id === taskId) task.isDone = !task.isDone;
      return task;
    });
    localStorage.setItem("todo-" + storageName, JSON.stringify(newTasksArray));
    setTasks(sortByIsDone(newTasksArray));
  }

  return (
    <>
      <div className={styles.list}>
        <header className={styles.listHeader}>
          <form onSubmit={handleCreateNewTask}>
            <input
              placeholder="Add a new Task"
              type="text"
              id="newTask"
              value={newTaskText}
              required
              onInvalid={handleNewCommentInvalid}
              onChange={(e) => handleTypeNewTaskText(e)}
              className={styles.listInputNewTask}
              />
            <button type="submit" className={styles.listButtonNewTask}>
              Create <PlusCircle size={15}></PlusCircle>
            </button>
          </form>
        </header>

        <div className={styles.group}>
          { children }

          <ListContent
            onDelete={deleteTask}
            onSelect={selectTask}
            tasks={tasks}
            storageName={storageName}
          ></ListContent>
        </div>
      </div>
    </>
  );
}
