import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [profile, setProfile] = useState({});
  const [address, setAddress] = useState(null);
  const [editable, setEditable] = useState(false);
  const [bucketKeys, setBucketKeys] = useState({});
  const [friendRequests, setFriendRequests] = useState([]);
  const [profilePrivate, setProfilePrivate] = useState({});
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);

  return (
    <DataContext.Provider
      value={{
        profile,
        setProfile,
        address,
        setAddress,
        editable,
        setEditable,
        bucketKeys,
        setBucketKeys,
        friendRequests,
        setFriendRequests,
        profilePrivate,
        setProfilePrivate,
        friendRequestsSent,
        setFriendRequestsSent,
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
