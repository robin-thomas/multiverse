import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [theme, setTheme] = useState('light');
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [profileAddress, setProfileAddress] = useState(null);

  document.body.setAttribute('data-theme', theme);

  return (
    <DataContext.Provider
      value={{
        theme,
        setTheme,
        address,
        setAddress,
        provider,
        setProvider,
        encryptionKey,
        setEncryptionKey,
        profileAddress,
        setProfileAddress,
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
