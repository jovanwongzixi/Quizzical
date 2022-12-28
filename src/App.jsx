import React, {useEffect, useState} from "react";
import {initializeApp} from "firebase/app"
import { getFirestore, setDoc, getDoc, doc } from "firebase/firestore";
import Homepage from "./Homepage";
import Quiz from "./Quiz";
//import firebaseConfig from "./firebaseConfig";

const db = getFirestore(initializeApp(JSON.parse(process.env.FIREBASE_CONFIG)||firebaseConfig))
//const querySnapshot = await getDoc(doc(db,"leaderboard","jIF4HvapctiqSYb0DJuA"))

export default function App(){
    const [quizStarted, setQuizStarted] = useState(false)
    const [leaderboard, setLeaderboard] = useState([]) //JSON.parse(localStorage.getItem("leaderboard")) || querySnapshot.data()['leaderboard-array']
    const [currentPlayer, setCurrentPlayer] = useState({})
    const [formData, setFormData] = useState({
        name: "",
        category: "any",
        difficulty: "any",
    })

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
        setLeaderboard(prevLeaderboard => {
            const tempLeaderboard = prevLeaderboard.slice()
            tempLeaderboard.push({
                ...currentPlayer,
                score: data
            })
            return tempLeaderboard
        })
    }
    useEffect(
        () => {
            async function retrieveDocs(){
                const querySnapshot = await getDoc(doc(db,"leaderboard","jIF4HvapctiqSYb0DJuA"))
                setLeaderboard(querySnapshot.data()['leaderboard-array'])
            }
            retrieveDocs()
        }, []
    )
    useEffect(
        () => {
            localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
            if(leaderboard.length > 0) {
                const docRef = setDoc(doc(db, "leaderboard", "jIF4HvapctiqSYb0DJuA"), {
                "leaderboard-array": leaderboard
            })}
        }
        , [leaderboard]
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
