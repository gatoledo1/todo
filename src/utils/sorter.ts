import { ITask } from "../types/iTask";

export const sorter = (tasks: ITask[], sortBy: string = "") => {

  const sortOptions = {
    alphabetical: (a: { content: string }, b: { content: string }) => a.content.localeCompare(b.content),
    recent: (a: { created_at: number }, b: { created_at: number }) =>
      b.created_at - a.created_at,
    oldest: (a: { created_at: number }, b: { created_at: number }) =>
      a.created_at - b.created_at,
  };

  //@ts-ignore
  return sortBy !== "" ? [...tasks].sort(sortOptions[sortBy] || []) : tasks;
}