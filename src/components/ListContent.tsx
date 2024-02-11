import { ClipboardText } from "phosphor-react";
import { ITask } from "../types/iTask";
import styles from "./ListContent.module.css";
import ListItem from "./ListItem";
import { useState } from "react";
import { sorter } from "../utils/sorter";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export interface IListContentProps {
  tasks: ITask[];
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  onDelete: (taskId: string) => void;
  onSelect: (taskId: string) => void;
  storageName: string;
}

export default function ListContent({ tasks, setTasks, onDelete, onSelect, storageName }: IListContentProps) {

  const [sortBy, setSortBy] = useState("");
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

  function onDragEnd(result: { destination: { index: number; }; source: { index: number; }; }) {
    if (!result.destination) {
      return;
    }

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setTasks(reorderedTasks);
  }

  return (
    <div className={styles.listContent}>
      {/* @ts-ignore */}
      <DragDropContext onDragEnd={onDragEnd}>
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
            <option value="">Drag & drop</option>
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
            <Droppable droppableId="tasks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {sortedItems.map(({ content, id, isDone }: ITask, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ListItem
                            onDelete={onDeleteTaskProps}
                            onSelect={onSelectTaskProps}
                            key={`${id}-${content}`}
                            taskId={id}
                            content={content}
                            isDone={isDone}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
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
      </DragDropContext>
    </div>
  );
}
