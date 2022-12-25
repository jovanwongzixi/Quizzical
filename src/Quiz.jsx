import React, {useState, useEffect} from "react";
import Question from "./Question";
/*
 * -1 for unselected option
 * 0 for unselected and wrong option
 * 1 for selected option
 * 2 for selected and wrong option
 * 3 for correct option
*/
export default function Quiz(props){
    const [questions, setQuestions] = useState([])
    const [answersChecked, setAnswersChecked] = useState(false)
    const [optionsState, setOptionsState] = useState([])
    const [numberOfCorrectOptions, setNumberOfCorrectOptions] = useState(0)
    const [correctOptionPositions, setCorrectOptionPositions] = useState([])

    useEffect(
        () =>{
            const apiURL = `https://opentdb.com/api.php?amount=5${props.quizType.category!=='any' ? `&category=${props.quizType.category}` : ""}${props.quizType.difficulty!=='any' ? `&difficulty=${props.quizType.difficulty}` : ""}&type=multiple`
            fetch(apiURL)
            .then(res => res.json())
            .then(data => {
                const results = data.results
                setQuestions(results)
                setOptionsState(()=>results.map(()=>[-1,-1,-1,-1]))
                setCorrectOptionPositions(() => results.map(()=>Math.floor(Math.random()*4)))
            })
        }, []
    )

    function decodeHtml(text){
        var txt = document.createElement("textarea")
        txt.innerHTML = text
        return txt.value
    }

    function flipAnswersChecked(){
        if(!answersChecked){
            let correctlyChosenOptions = 0
            const tempOptionsState = optionsState.slice()
            for(let i=0; i<tempOptionsState.length; i++){
                if(optionsState[i][correctOptionPositions[i]]===1) correctlyChosenOptions++
                for(let j=0; j<tempOptionsState[i].length; j++){
                    if(j===correctOptionPositions[i]) tempOptionsState[i][j] = 3 //setState for correct answer
                    else tempOptionsState[i][j]++ //setState for incorrect answers
                }
            }
            setOptionsState(tempOptionsState)
            setNumberOfCorrectOptions(correctlyChosenOptions)
            props.updateLeaderboard(correctlyChosenOptions)
        }
        setAnswersChecked(oldValue => !oldValue)
    }
    
    function changeOptionState(qnIndex, optionIndex){
        setOptionsState(prevState => {
            const tempPrevState = prevState.slice()
            const newQuestionState = tempPrevState[qnIndex].map(
                (val, index) => {
                    return index===optionIndex ?
                    -1*val :
                    -1
                }
            )
            tempPrevState[qnIndex] = newQuestionState
            return tempPrevState
        })
    }
    const questionsArray = questions.map((obj, index)=>{
        const correctAnswer = decodeHtml(obj.correct_answer)
        const incorrectAnswers = obj.incorrect_answers.map((option)=>decodeHtml(option))
        const options = [...incorrectAnswers.slice(0, correctOptionPositions[index]), correctAnswer, ...incorrectAnswers.slice(correctOptionPositions[index])]
        return <Question
            key={index} 
            question={decodeHtml(obj.question)} 
            options={options}
            optionsState={optionsState[index]}
            correctAnswer={correctAnswer}
            onClick ={!answersChecked ? ((optionIndex)=>changeOptionState(index, optionIndex)) : function(){}}
        />
    })
    const checkAnswer = <footer>
                            <button className="quizBtn" onClick={flipAnswersChecked}>Check Answer</button>
                        </footer>
    const answerIsChecked = <footer>
                                <h3 className="numCorrectAnswers">{`You have ${numberOfCorrectOptions}/5 correct answers`}</h3>
                                <button 
                                    className="quizBtn"
                                    onClick={()=>{
                                        flipAnswersChecked()
                                        props.playAgain()
                                    }}
                                >Play Again</button>
                            </footer>
    return(
        <div className="quiz">
            {questionsArray}
            {questions.length!==0 && (!answersChecked ? checkAnswer : answerIsChecked)}
        </div>
    )
}