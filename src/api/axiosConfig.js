import axios from "axios";

export default axios.create({
    baseURL: "https://quizzical-leaderboard.fly.dev/"
    //headers: {"Access-Control-Allow-Origin": true}
})