import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [profile, setProfile] = useState({});
  const [address, setAddress] = useState(null);
  const [editable, setEditable] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [profilePrivate, setProfilePrivate] = useState({});

  return (
    <DataContext.Provider
      value={{
        profile,
        setProfile,
        address,
        setAddress,
        editable,
        setEditable,
        friendRequests,
        setFriendRequests,
        profilePrivate,
        setProfilePrivate,
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
