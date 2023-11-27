import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface IToDo {
  id: number;
  text: string;
}

interface IToDoStage {
  [key: string]: IToDo[];
}

const { persistAtom } = recoilPersist({
  key: "task",
  storage: localStorage,
});

export const toDoState = atom<IToDoStage>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom],
});
