import React from "react";
import Avatar from "../avatar.jpg";

const User = ({ user }) => {
  return (
    <div className="user_wrapper">
      <div className="user_info">
        <div className="user_detail">
          <img src={user.avatar || Avatar} alt="avatar" className="avatar" />
          <h4>{user.name}</h4>
        </div>
        <div
          className={`user_status ${user.isOnline ? "online" : "offline"}`}
        ></div>
      </div>
    </div>
  );
};

export default User;