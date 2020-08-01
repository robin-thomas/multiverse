import React, { useRef, useState, useEffect, useContext } from 'react';

import _ from 'lodash';
import SimpleBar from 'simplebar-react';

import Friend from './Friend';
import Messages from './Messages';
import Box from '../../../utils/3box';
import File from '../../../utils/file';
import { DataContext } from '../DataProvider';

import styles from './Content.module.css';

const Content = ({ state, onNew, onClick }) => {
  const ctx = useContext(DataContext);

  const simpleBar = useRef(null);
  const simpleBarEle = useRef(null);

  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (_.has(ctx.profilePrivate, 'chats')) {
      const _friends = Object.keys(ctx.profilePrivate.chats).map((_address) => {
        let _friend = Box.message.request.items.find(
          (e) => e.message.me.address === _address
        );
        if (!_friend) {
          _friend = Box.message.response.items.find(
            (e) => e.message.me.address === _address
          );
        }

        return {
          address: _address,
          username: _friend.message.me.username,
          profilePic: _friend.message.me.profilePic,
        };
      });

      setFriends(_friends);
    }
  }, [ctx.profilePrivate.chats]);

  useEffect(() => {
    const load = async () => {
      for (const friend of friends) {
        if (!ctx.profilePics[friend.address]) {
          if (friend.profilePic) {
            const imgUrl = await File.avatar(friend.profilePic);

            ctx.setProfilePics((_pics) => {
              return {
                ..._pics,
                [friend.address]: imgUrl,
              };
            });
          }
        }
      }
    };

    if (friends.length > 0) {
      load();
    }
  }, [friends]);

  useEffect(() => {
    if (state === 1) {
      simpleBar.current.recalculate();
      simpleBarEle.current.scrollTop = simpleBarEle.current.scrollHeight - 415;
    }
  }, [state, messages]);

  return (
    <SimpleBar
      ref={simpleBar}
      className={styles['content']}
      scrollableNodeProps={{ ref: simpleBarEle }}
    >
      {state === 0 ? (
        friends.map((friend, index) => (
          <Friend
            key={index}
            {...friend}
            setMessages={setMessages}
            onClick={onClick}
            onNew={onNew}
            profilePic={ctx.profilePics[friend.address]}
          />
        ))
      ) : (
        <Messages messages={messages} />
      )}
    </SimpleBar>
  );
};

export default Content;
