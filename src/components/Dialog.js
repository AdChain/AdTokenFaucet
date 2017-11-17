import React from 'react';

const style = {
	dialogStyle : {
	  color: '#F79220',
	  fontWeight: 'bold',
	  textAlign:"center",
	  borderRadius: "5px"
	},
	infoBlock:{
      backgroundColor: "#1190ff",
      fontSize: "1em",
      padding: "1em 7em",
      borderRadius: "5px",
      color:"white",
      marginTop: "50px"
  }
}

const Dialog = ({ message, loading,metaMask}) => {
  return (
    <div style={style.dialogStyle} className={ loading ? 'hidden'  : '' }>
      <div style={style.infoBlock} className={ metaMask ? 'hidden'  : '' }>
      	{message}
      </div>
    </div>
  );
};

export default Dialog;
