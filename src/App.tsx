import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IToDoStage, toDoState } from "./atoms";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import TrashCan from "./Components/TrashCan";
import Board from "./Components/Board";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Title = styled.div`
  font-size: 40px;
  font-weight: bold;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
  input {
    width: 80%;
    height: 32px;
    font-size: 15px;
    border: 0;
    border-radius: 15px;
    outline: none;
    padding-left: 20px;
    background-color: ${(props) => props.theme.cardColor};
  }
`;

interface IForm {
  category: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ category }: IForm) => {
    setToDos((prev) => {
      return {
        ...prev,
        [category]: [],
      };
    });
    setValue("category", "");
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination.droppableId === "TrashCan") {
      if (isNaN(Number(info.draggableId))) return;

      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        sourceBoard.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
        };
      });
      return;
    }
    if (destination.droppableId === "board-list") {
      setToDos((allBoards) => {
        const keys = Object.keys({ ...allBoards });
        const targetKey = keys[source.index];
        keys.splice(source.index, 1);
        keys.splice(destination.index, 0, targetKey);
        const reorderedBoards = keys.reduce((acc: IToDoStage, key: string) => {
          acc[key] = allBoards[key];
          return acc;
        }, {});

        return reorderedBoards;
      });
      return;
    }

    if (destination?.droppableId === source.droppableId) {
      if (isNaN(Number(info.draggableId))) return;

      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
      return;
    }
    if (destination.droppableId !== source.droppableId) {
      if (isNaN(Number(info.draggableId))) return;
      // cross board movement.
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
      return;
    }
  };

  return (
    <Container>
      <Title>ToDos</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("category", { required: true })}
          type="text"
          placeholder={"Please enter the category name."}
        />
      </Form>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Content>
            <Droppable droppableId="board-list" direction="horizontal">
              {(magic) => (
                <Boards ref={magic.innerRef} {...magic.droppableProps}>
                  {Object.keys(toDos).map((boardId, index) => (
                    <Board
                      key={boardId}
                      toDos={toDos[boardId]}
                      boardId={boardId}
                      index={index}
                    />
                  ))}
                </Boards>
              )}
            </Droppable>
            <TrashCan />
          </Content>
        </Wrapper>
      </DragDropContext>
    </Container>
  );
}

export default App;
