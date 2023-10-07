import { atom, selector } from "recoil";

interface IToDoStage {
  [key: string]: string[];
}

export const toDoState = atom<IToDoStage>({
  key: "toDo",
  default: {
    "To Do": ["a", "b"],
    Doing: ["c", "d", "e"],
    Done: ["f"],
  },
});
