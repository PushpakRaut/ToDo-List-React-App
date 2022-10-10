import { useEffect, useRef, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");

  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};
const getCompleteList = () => {
  let completeList = localStorage.getItem("completeList");

  if (completeList) {
    return JSON.parse(localStorage.getItem("completeList"));
  } else {
    return [];
  }
};

function App() {
  const [task, setTask] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [completeList, setCompleteList] = useState(getCompleteList());
  const [isList, setIsList] = useState(false);
  const inputRef = useRef(null);
  const [edit, setEdit] = useState("");

  let listLen = list.length;
  let completeListLen = completeList.length;

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
    localStorage.setItem("completeList", JSON.stringify(completeList));
  }, [list, completeList]);

  const handleSubmit = () => {
    if (!task) {
      alert("Enter Task...");
    } else {
      setIsList(true);
    }
  };

  useEffect(() => {
    if (isList && task) {
      var currentDate = new Date();
      var date =
        (currentDate.getDate() > 9 ? "" : "0") +
        currentDate.getDate() +
        "/" +
        (currentDate.getMonth() + 1 > 9 ? "" : "0") +
        (currentDate.getMonth() + 1) +
        "/" +
        currentDate.getFullYear() +
        " " +
        (currentDate.getHours() > 12
          ? currentDate.getHours() - 12 > 10
            ? currentDate.getHours() - 12
            : "0" + currentDate.getHours() - 12
          : currentDate.getHours()) +
        ":" +
        (currentDate.getMinutes() > 10 ? "" : "0") +
        currentDate.getMinutes() +
        (currentDate.getHours() > 12 ? " PM" : " AM");

      const newItem = {
        task,
        id: new Date().getTime().toString(),
        date,
      };
      setList([...list, newItem]);
      setTask("");
      setIsList(false);
      listLen = list.length;
      completeListLen = completeList.length;
    }
  }, [isList]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleComplete = (id) => {
    setList(list.filter((todo) => todo.id !== id));
    let compltedTodo = list.filter((todo) => todo.id === id);
    setCompleteList(completeList.concat(compltedTodo));
  };

  const handleUndo = (id) => {
    setCompleteList(completeList.filter((todo) => todo.id !== id));
    let undoTodo = completeList.filter((todo) => todo.id === id);
    setList(list.concat(undoTodo));
  };

  const handleListDelete = (id) => {
    setList(list.filter((todo) => todo.id !== id));
  };

  const handleCompleteListDelete = (id) => {
    setCompleteList(completeList.filter((todo) => todo.id !== id));
  };

  const handleCancel = () => {
    setEdit("");
  };

  const changeTask = (e) => {
    let newEntry = {
      id: edit.id,
      task: e.target.value,
      date: edit.date,
    };
    setEdit(newEntry);
  };

  const handleDone = () => {
    let filterRecords = [...list].filter((todo) => todo.id !== edit.id);
    let updateRecord = [...filterRecords, edit];
    setList(updateRecord);
    setEdit("");
  };

  return (
    <section className="main-section">
      <h1 className="todoHeader">To Do List</h1>
      <div className="inputBar">
        <form>
          {edit ? (
            <input
              type="text"
              placeholder="Enter Tittle"
              className="input-tittle"
              id="inputTittle"
              name="name"
              value={edit && edit.task}
              onChange={(e) => changeTask(e)}
              ref={inputRef}
            />
          ) : (
            <input
              type="text"
              placeholder="Enter Tittle"
              className="input-tittle"
              id="inputTittle"
              name="name"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              ref={inputRef}
            />
          )}
        </form>
        {edit ? (
          <>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="done-btn" onClick={handleDone}>
              Done
            </button>
          </>
        ) : (
          <button className="add-btn" onClick={handleSubmit}>
            Add Task
          </button>
        )}
      </div>
      <div className="container">
        <div className="header">
          <h2>Daily Life Todo List</h2>
        </div>
        <div className="tasks">
          <div className="remaining">
            <h4>In progress {"(" + listLen + ")"}</h4>
            <div className="remain-container">
              {list && list.length ? "" : <h4>No Tasks...</h4>}
              {list &&
                list
                  .sort((a, b) => (a.id > b.id ? 1 : -1))
                  .map((info) => {
                    const { id, task, date } = info;
                    return (
                      <div className="task-container" key={id}>
                        <p className="taskTittle">{task}</p>
                        <div className="icons">
                          <p className="date">{date}</p>
                          <div>
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="icon checkIcon"
                              onClick={() => handleComplete(id)}
                            />
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="icon editIcon"
                              onClick={() =>
                                setEdit({
                                  id: id,
                                  task: task,
                                  date: date,
                                })
                              }
                            />
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="icon deleteIcon"
                              onClick={() => handleListDelete(id)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
          <div className="completed">
            <h4>Completed {"(" + completeListLen + ")"}</h4>
            <div className="remain-container">
              {completeList && completeList.length ? "" : <h4>No Tasks...</h4>}
              {completeList &&
                completeList
                  .sort((a, b) => (a.id > b.id ? 1 : -1))
                  .map((info) => {
                    const { id, date, task } = info;
                    return (
                      <div className="task-container" key={id}>
                        <p className="taskTittle">{task}</p>
                        <div className="icons">
                          <p className="date">{date}</p>
                          <div>
                            <FontAwesomeIcon
                              icon={faUndo}
                              className="icon checkIcon"
                              onClick={() => handleUndo(id)}
                            />
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="icon deleteIcon"
                              onClick={() => handleCompleteListDelete(id)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
