import React, { useEffect, useState } from "react";
import Avatar from "../avatar.jpg";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

const User = ({ user, selectUser, sender, chat }) => {
  const receiver = user?.uid;
  const [data, setData] = useState(null);

  useEffect(() => {
    const id =
      sender > receiver ? `${sender + receiver}` : `${receiver + sender}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, [sender, receiver]);

  return (
    <div
      className={`user_wrapper ${
        chat && chat.name === user.name && "selected_user"
      }`}
      onClick={() => selectUser(user)}
    >
      <div className="user_info">
        <div className="user_detail">
          <img src={user.avatar || Avatar} alt="avatar" className="avatar" />
          <h4>{user.name}</h4>
          {data?.from !== sender && data?.unread && (
            <small className="unread">New</small>
          )}
        </div>
        <div
          className={`user_status ${user.isOnline ? "online" : "offline"}`}
        ></div>
      </div>
      {data && (
        <p className="truncate">
          <strong>{data.from === sender ? "Me:" : null}</strong>
          {data.text}
        </p>
      )}
    </div>
  );
};

export default User;
