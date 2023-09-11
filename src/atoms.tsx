import { atom, selector } from "recoil";

interface IToDoStage {
  [key: string]: string[];
}

export const toDoState = atom<IToDoStage>({
  key: "toDo",
  default: {
    to_do: ["a", "b"],
    doing: ["c", "d", "e"],
    done: ["f"],
  },
});
