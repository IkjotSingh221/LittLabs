import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [taskTypeList, setTaskTypeList] = useState([]);
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ tasks, setTasks, taskTypeList, setTaskTypeList, notes, setNotes, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
