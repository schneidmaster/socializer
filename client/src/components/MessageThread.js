import React, { useContext, useLayoutEffect, useRef } from "react";
import cx from "classnames";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Gravatar from "react-gravatar";
import { AuthContext } from "util/context";
import "./MessageThread.css";

const MessageThread = ({ messages }) => {
  const messageThread = useRef();
  const { userId } = useContext(AuthContext);

  useLayoutEffect(() => {
    messageThread.current.scrollTop = messageThread.current.scrollHeight;
  });

  return (
    <div ref={messageThread} className="chat-messages">
      {messages.map((message, idx) => (
        <div
          key={message.id}
          className={cx("d-flex", {
            "chat-self": message.user.id === String(userId),
            "chat-others": message.user.id !== String(userId),
          })}
        >
          <div className="d-flex mb-1 chat-bubble-wrapper">
            {idx === 0 || messages[idx - 1].user.id !== message.user.id ? (
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id={`user-${message.user.id}`}>
                    {message.user.name}
                  </Tooltip>
                }
              >
                <Gravatar
                  md5={message.user.gravatarMd5}
                  className="rounded-circle mt-1"
                  size={30}
                />
              </OverlayTrigger>
            ) : (
              <div className="avatar-spacer" />
            )}
            <div className="p-2 chat-bubble">{message.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
