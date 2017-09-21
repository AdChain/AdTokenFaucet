import React from 'react';

const dialogStyle = {
    margin: '2em'
}

const Dialog = ({ message, subMessage }) => {
  return (
    <div style={dialogStyle}>
        <div>{message}</div>
        <div>{subMessage}</div>
    </div>
  );
};

export default Dialog;
