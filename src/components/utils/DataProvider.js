import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [profile, setProfile] = useState({});
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [editable, setEditable] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [profileAddress, setProfileAddress] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  // document.body.setAttribute('data-theme', theme);

  return (
    <DataContext.Provider
      value={{
        profile,
        setProfile,
        address,
        setAddress,
        provider,
        setProvider,
        encryptionKey,
        setEncryptionKey,
        profileAddress,
        setProfileAddress,
        editable,
        setEditable,
        friendRequests,
        setFriendRequests,
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
