import { ClipboardText } from "phosphor-react";
import { ITask } from "../types/iTask";
import styles from "./ListContent.module.css";
import ListItem from "./ListItem";
import { useState } from "react";
import { sorter } from "../utils/sorter";

export interface IListContentProps {
  tasks: ITask[];
  onDelete: (taskId: string) => void;
  onSelect: (taskId: string) => void;
  storageName: string;
}

export default function ListContent({ tasks, onDelete, onSelect, storageName }: IListContentProps) {
  const [sortBy, setSortBy] = useState("recent");
  const sortedItems = sorter(tasks, sortBy);
  
  const createdTasksCount = tasks.length;
  const doneTasksCount = tasks.filter(
    (task: ITask) => task.isDone === true
  ).length;

  function onDeleteTaskProps(taskId: string) {
    onDelete(taskId);
  }

  function onSelectTaskProps(taskId: string) {
    onSelect(taskId);
  }

  return (
    <div className={styles.listContent}>
      <header className={styles.listContentHeader}>
        <div className={styles.listCreatedTaskCounter}>
          Created
          <span>{createdTasksCount}</span>
        </div>
        <select
          className={styles.sortItems}
          value={sortBy}
          id="sortSelect"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="alphabetical">Alphabetical</option>
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
        </select>
        <div className={styles.listDoneTaskCounter}>
          Done
          <span>
            {doneTasksCount} of {createdTasksCount}
          </span>
        </div>
      </header>
      {tasks.length === 0 ? (
        <div className={styles.emptyList}>
          <ClipboardText size={72}></ClipboardText>
          <strong>You don't have any tasks registered yet.</strong>
          <p>Create tasks and organize your to-do items</p>
        </div>
      ) : (
        <main className={styles.listItensContainer}>
          {sortedItems.map(({ content, id, isDone }: ITask) => (
            <ListItem
            onDelete={onDeleteTaskProps}
            onSelect={onSelectTaskProps}
            key={`${id}-${content}`}
            taskId={id}
            content={content}
            isDone={isDone}
            ></ListItem>
          ))}
        </main>
      )}
      <div className={styles.containerBtns}>
        <button className={styles.copyContext} onClick={async () => {
          try {
            const shareData = {
              title: 'Shared Tasks',
              text: JSON.stringify(tasks),
            };

            await navigator?.share(shareData);
          } catch (error) {
            console.error('Erro ao compartilhar:', error);

            await navigator?.clipboard.writeText(JSON.stringify(tasks));
            confirm('Copied to clipboard!');
          }
        }}>Copy context</button>
        <button className={styles.deleteContext} onClick={() => {
          const text = "Want to delete your current context?";
          if (confirm(text) == true) {
            localStorage.removeItem("todo-" + storageName)
            location?.reload();
          } else {
            return false
          }
        }}>Delete context</button>
      </div>
    </div>
  );
}
