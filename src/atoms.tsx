import { atom } from "recoil";

export interface IToDo {
  id: number;
  text: string;
}

interface IToDoStage {
  [key: string]: IToDo[];
}

export const toDoState = atom<IToDoStage>({
  key: "toDo",
  default: {
    "To Do": [
      { id: 1, text: "hello" },
      { id: 2, text: "hello" },
    ],
    Doing: [],
    Done: [],
  },
});
