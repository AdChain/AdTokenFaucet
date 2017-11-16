import React from 'react';

const style = {
	dialogStyle : {
	  color: '#F79220',
	  fontWeight: 'bold',
	  textAlign:"center"
	},
	infoBlock:{
      padding:"15px ",
      backgroundColor: "#1190ff",
      fontSize: "1em",
      padding: "1em 7em",
      borderRadius: "5px",
      color:"white",
      marginTop: "50px"
  }
}

const Dialog = ({ message, subMessage }) => {
  return (
    <div style={style.dialogStyle}>
      <div style={style.infoBlock}>
      	{message}
      </div>
      <div>{subMessage}</div>
    </div>
  );
};

export default Dialog;
