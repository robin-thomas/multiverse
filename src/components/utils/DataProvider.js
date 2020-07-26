import React, { useState } from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
  const [denied, setDenied] = useState(false);
  const [profile, setProfile] = useState({});
  const [address, setAddress] = useState(null);
  const [editable, setEditable] = useState(false);
  const [bucketKeys, setBucketKeys] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [profilePics, setProfilePics] = useState({});
  const [friendRequests, setFriendRequests] = useState([]);
  const [profilePrivate, setProfilePrivate] = useState({});
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);
  const [backdropOpen, setBackdropOpen] = useState(false);

  return (
    <DataContext.Provider
      value={{
        denied,
        setDenied,
        profile,
        setProfile,
        address,
        setAddress,
        editable,
        setEditable,
        bucketKeys,
        setBucketKeys,
        profilePic,
        setProfilePic,
        profilePics,
        setProfilePics,
        friendRequests,
        setFriendRequests,
        profilePrivate,
        setProfilePrivate,
        friendRequestsSent,
        setFriendRequestsSent,
        backdropOpen,
        setBackdropOpen,
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
