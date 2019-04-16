import React, { useContext, useLayoutEffect, useRef } from "react";
import cx from "classnames";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Gravatar from "react-gravatar";
import { AuthContext } from "util/context";
import classes from "./MessageThread.module.css";

const MessageThread = ({ messages }) => {
  const messageThread = useRef();
  const { userId } = useContext(AuthContext);

  useLayoutEffect(() => {
    messageThread.current.scrollTop = messageThread.current.scrollHeight;
  });

  return (
    <div ref={messageThread} className={classes.chatMessages}>
      {messages.map((message, idx) => (
        <div
          key={message.id}
          className={cx("d-flex", {
            [classes.chatSelf]: message.user.id === String(userId),
            [classes.chatOthers]: message.user.id !== String(userId),
          })}
        >
          <div className={cx("d-flex", "mb-1", classes.chatBubbleWrapper)}>
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
              <div className={classes.avatarSpacer} />
            )}
            <div className={cx("p-2", classes.chatBubble)}>{message.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
