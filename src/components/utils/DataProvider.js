import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [page, setPage] = useState('home');

  return (
    <DataContext.Provider
      value={{
        page,
        setPage,
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
