import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [page, setPage] = useState('home');
  const [theme, setTheme] = useState(0);

  return (
    <DataContext.Provider
      value={{
        page,
        setPage,
        theme,
        setTheme,
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
