import axios from "axios";

const API_KEY = process.env.c9f5f6bc4cbe579935daac7e54ca37d3;

export async function getWeather() {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=Bangkok&appid=${API_KEY}&units=metric`
  );

  return {
    temp: res.data.main.temp,
    desc: res.data.weather[0].description
  };
}