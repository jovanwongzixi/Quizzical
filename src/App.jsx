import React, {useEffect, useState, useRef} from "react";
import Homepage from "./Homepage";
import Quiz from "./Quiz";
import api from "./api/axiosConfig"


export default function App(){
    const [quizStarted, setQuizStarted] = useState(false)
    const [leaderboard, setLeaderboard] = useState([])
    const [currentPlayer, setCurrentPlayer] = useState({})
    const [formData, setFormData] = useState({
        name: "",
        category: "any",
        difficulty: "any",
    })

    const updateMongoLeaderboard = async(name, score) => {
        try {
	        const res = await api.post("/api/leaderboard/add", {name: name, score: score.toString()})
            console.log("push to leaderboard")
            console.log(`name: ${name} scoree: ${score}`)
        } catch (error) {
            console.log(error)
        }
    }

    function handleChange(event){
        const {name, value} = event.target
        setFormData( prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
    }
    function flipQuizStarted(){
        if(!quizStarted){
            const name = formData.name==="" ? "player" : formData.name
            setCurrentPlayer({name: name})
        }
        setQuizStarted(prevState => !prevState)
    }
    function updateLeaderboard(data){
        console.log("Updating leaderboard")
        setLeaderboard(prevLeaderboard => {
            const tempLeaderboard = prevLeaderboard.slice()
            tempLeaderboard.push({
                ...currentPlayer,
                score: data
            })
            return tempLeaderboard
        })
        updateMongoLeaderboard(currentPlayer.name, data)
    }
    
    useEffect(
        () => {
            async function retrieveDocs(){
                const res = await api.get("/api/leaderboard/get")
                setLeaderboard(res.data)
                console.log(res.data)
            }
            retrieveDocs()
        }, []
    )

    return(
        <>
            {
                !quizStarted ? 
                <Homepage 
                    start={flipQuizStarted}
                    leaderboard={leaderboard}
                    formData={formData}
                    onChange = {handleChange}
                /> : 
                <Quiz 
                    playAgain={flipQuizStarted} 
                    updateLeaderboard={updateLeaderboard}
                    quizType={{
                        category: formData.category,
                        difficulty: formData.difficulty,
                    }}
                />
            }
        </>
        
    )
}
