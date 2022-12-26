import React from "react";

export default function Leaderboard(props){
    const leaderboard = props.leaderboard
    leaderboard.sort((a,b) => b.score - a.score)
    let prevScore = -1
    const leaderboardItems = leaderboard.map((value, index) => {
        const ranking = value.score === prevScore ? '-' : index+1
        prevScore = value.score
        return(
            <tr key={index}>
                <td>{ranking}</td>
                <td>{value.name}</td>
                <td>{value.score}</td>
            </tr>
        )}
    )
    return(
        <table className="leaderboard">
            <caption>Leaderboard (Top 10)</caption>
            <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
            </tr>
            {leaderboardItems.length >10 ? leaderboardItems.slice(0,10) : leaderboardItems}
        </table>
    )
}