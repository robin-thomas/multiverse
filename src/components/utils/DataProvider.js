import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [page, setPage] = useState('home');
  const [theme, setTheme] = useState('light');
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState(null);

  return (
    <DataContext.Provider
      value={{
        page,
        setPage,
        theme,
        setTheme,
        loggedIn,
        setLoggedIn,
        provider,
        setProvider,
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
