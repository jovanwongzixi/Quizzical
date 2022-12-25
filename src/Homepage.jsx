import React, { useState } from "react";
import Leaderboard from "./Leaderboard";

export default function Homepage(props){
    const formData = props.formData
    return(
        <main className="homepage">
            <h2 className="quizzical">Quizzical</h2>
            <p>Quiz game created with opentdb API</p>
            <form onSubmit={props.start}>
                <select 
                    name="category"
                    value={formData.category}
                    onChange={props.onChange}
                >
                    <option value="any">Any Category</option>
                    <option value="9">General Knowledge</option>
                    <option value="10">Entertainment: Books</option>
                    <option value="11">Entertainment: Film</option>
                    <option value="12">Entertainment: Music</option>
                    <option value="13">Entertainment: Musicals & Theatres</option>
                    <option value="14">Entertainment: Television</option>
                    <option value="15">Entertainment: Video Games</option>
                    <option value="16">Entertainment: Board Games</option>
                    <option value="17">Science & Nature</option>
                    <option value="18">Science: Computers</option>
                    <option value="19">Science: Mathematics</option>
                    <option value="20">Mythology</option>
                    <option value="21">Sports</option>
                    <option value="22">Geography</option>
                    <option value="23">History</option>
                    <option value="24">Politics</option>
                    <option value="25">Art</option>
                    <option value="26">Celebrities</option>
                    <option value="27">Animals</option>
                    <option value="28">Vehicles</option>
                    <option value="29">Entertainment: Comics</option>
                    <option value="30">Science: Gadgets</option>
                    <option value="31">Entertainment: Japanese Anime & Manga</option>
                    <option value="32">Entertainment: Cartoon & Animations</option>
                </select>
                <select 
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={props.onChange}    
                >
                    <option value="any">Any Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    name="name"
                    onChange={props.onChange}
                />
                <button className="quizBtn">Start quiz</button>
            </form>
            {props.leaderboard.length>0 && <Leaderboard leaderboard={props.leaderboard}/>}
        </main>
    )
}