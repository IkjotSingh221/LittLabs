import { readTodos, readTaskType } from "../ToDoPage/todoApi";
import { readNotes } from "../NotesPage/notesApi";

export const loadTasks = async (username, setTasks) => {
  try {
    const todos = await readTodos(username);
    const mappedTasks = todos.map((task) => {
      return {
        taskKey: task.taskKey,
        taskName: task.taskName,
        taskDescription: task.taskDescription,
        dueDate: task.dueDate,
        taskColor: task.taskColor,
        taskType: task.taskType,
        isCompleted: task.isCompleted,
      };
    });
    setTasks(mappedTasks);
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
};

export const loadTaskTypeList = async (username, setTaskTypeList) => {
  try {
    const taskTypes = await readTaskType(username);
    const mappedTaskTypeList = taskTypes.map((taskType) => {
      return {
        taskTypeKey: taskType.taskTypeKey,
        taskTypeName: taskType.taskTypeName,
        taskColor: taskType.taskTypeColor,
      };
    });
    setTaskTypeList(mappedTaskTypeList);
  } catch (error) {
    console.error("Error loading task types:", error);
  }
};

export const loadNotes = async (username, setNotes) => {
  try {
    const notesList = await readNotes(username);
    const mappedNotesList = notesList.map((note) => {
      return {
        noteKey: note.noteKey,
        noteTitle: note.noteTitle,
        noteText: note.noteText,
        creationDate: note.creationDate
      };
    });
    setNotes(mappedNotesList);
  } catch (error) {
    console.error("Error loading notes:", error);
  }
};
