import React, {useState} from "react";
import Choice from "./Choice";

export default function Question(props){
    const options = props.options.map((option, index)=> <Choice 
                                                            key={index} 
                                                            value={option}
                                                            optionState = {props.optionsState[index]} 
                                                            selectBtn={()=>{
                                                                props.onClick(index)
                                                            }}
                                                        />)
    return(
        <div className="question">
            <h3>{props.question}</h3>
            {options}
            <hr/>
        </div>
    )
}