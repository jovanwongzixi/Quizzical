import React, {useEffect, useState, useRef} from "react";
import {initializeApp} from "firebase/app"
import { getFirestore, setDoc, getDoc, doc } from "firebase/firestore";
import Homepage from "./Homepage";
import Quiz from "./Quiz";
import firebaseConfig from "./firebaseConfig";
import api from "./api/axiosConfig"

//const db = getFirestore(initializeApp(firebaseConfig))
//const querySnapshot = await getDoc(doc(db,"leaderboard","jIF4HvapctiqSYb0DJuA"))JSON.parse(process.env.FIREBASE_CONFIG)||

export default function App(){
    const [quizStarted, setQuizStarted] = useState(false)
    const [leaderboard, setLeaderboard] = useState([]) //JSON.parse(localStorage.getItem("leaderboard")) || querySnapshot.data()['leaderboard-array']
    const [currentPlayer, setCurrentPlayer] = useState({})
    const [formData, setFormData] = useState({
        name: "",
        category: "any",
        difficulty: "any",
    })

    //const revText = useRef()
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
                // const querySnapshot = await getDoc(doc(db,"leaderboard","jIF4HvapctiqSYb0DJuA"))
                // setLeaderboard(querySnapshot.data()['leaderboard-array'])
                const res = await api.get("/api/leaderboard/get")
                setLeaderboard(res.data)
                console.log(res.data)
            }
            retrieveDocs()
        }, []
    )
    // useEffect(
    //     () => {
    //         async function addLeaderboard(){
    //             console.log("updating leaderboard")
    //             try {
    //                 if(currentPlayer.name) {
    //                             //     const docRef = setDoc(doc(db, "leaderboard", "jIF4HvapctiqSYb0DJuA"), {
    //                             //     "leaderboard-array": leaderboard
                                    
    //                             // })
    //                     console.log(currentPlayer.name)
    //                     const res = await api.post("/api/leaderboard/add", {name:currentPlayer, score: leaderboard[currentPlayer]})
    //                     console.log(res)
    //                 }
    //             } catch (error) {
    //                 console.log(error)
    //             }
    //         }
    //         //localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
    //         addLeaderboard()
    //     }
    //     , [leaderboard]
    // )
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
