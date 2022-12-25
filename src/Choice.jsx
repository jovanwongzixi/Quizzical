import React from "react";

export default function Choice(props){
    let backgroundColor = "transparent"
    let opacity = 1
    if(props.optionState === 0){
        opacity = 0.5
    }
    else if(props.optionState === 1) backgroundColor = "#D6DBF5"
    else if(props.optionState === 2) {
        backgroundColor = "#F8BCBC"
        opacity=0.5
    }
    else if(props.optionState === 3) backgroundColor = "#94D7A2"

    const customStyle ={
        backgroundColor: backgroundColor,
        border: props.optionState>0 && "none",
        opacity: opacity,
    }
    return(
        <button 
            style={customStyle} 
            onClick={props.selectBtn} 
            className="choice"
        >{props.value}</button>
    )
}