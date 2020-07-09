import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [theme, setTheme] = useState('light');
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);

  return (
    <DataContext.Provider
      value={{
        theme,
        setTheme,
        address,
        setAddress,
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
