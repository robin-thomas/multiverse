import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [page, setPage] = useState('home');
  const [theme, setTheme] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <DataContext.Provider
      value={{
        page,
        setPage,
        theme,
        setTheme,
        loggedIn,
        setLoggedIn,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

const DataConsumer = DataContext.Consumer;

export { DataConsumer };
export { DataContext };
export default DataProvider;
