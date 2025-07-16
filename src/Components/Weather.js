import React, { useState } from 'react';
import './Weather.css';
import { FaSearch, FaWind } from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md';
import { WiHumidity } from 'react-icons/wi';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState();
  const [error, setError] = useState('');
  const [bgImage, setBgImage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = "5acc1683650652bab831ecf7d57fd397";

  const handleOnChange = (event) => {
    setCity(event.target.value);
  };

  const fetchData = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError('Please enter a city name.');
      setWeather(undefined);
      setBgImage('');
      return;
    }
    setLoading(true);
    setError('');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&units=metric&appid=${API_KEY}`;
    try {
      const response = await fetch(url);
      const output = await response.json();

      if (response.ok) {
        setWeather(output);
        setError('');

        const weatherType = output.weather[0].main;
        console.log('Weather Type:', weatherType); // DEBUG

        // Background switch
        switch (weatherType) {
          case 'Clear':
            setBgImage('https://source.unsplash.com/600x900/?sunny,sky');
            break;
          case 'Clouds':
            setBgImage('https://source.unsplash.com/600x900/?cloudy,sky');
            break;
          case 'Rain':
          case 'Drizzle':
            setBgImage('https://source.unsplash.com/600x900/?rain');
            break;
          case 'Thunderstorm':
            setBgImage('https://source.unsplash.com/600x900/?thunderstorm');
            break;
          case 'Snow':
            setBgImage('https://source.unsplash.com/600x900/?snow');
            break;
          case 'Mist':
          case 'Haze':
          case 'Fog':
            setBgImage('https://source.unsplash.com/600x900/?mist');
            break;
          default:
            setBgImage('https://source.unsplash.com/600x900/?weather');
        }
      } else {
        setError('City not found. Try again.');
        setWeather(undefined);
        setBgImage('');
      }
    } catch (err) {
      console.error(err);
      setError('Network error.');
      setWeather(undefined);
      setBgImage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='container'
      style={{
        position: 'relative',
        backgroundImage: bgImage ? 
          `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      {/* Snowflakes */}
      {[...Array(8)].map((_, i) => (
        <div className="snowflake" key={i}></div>
      ))}

      {/* Search */}
      <div className='city'>
        <input
          type='text'
          value={city}
          onChange={handleOnChange}
          placeholder='Enter any city name'
          disabled={loading}
        />
        <button onClick={fetchData} disabled={loading || !city.trim()}>
          {loading ? 'Loading...' : <FaSearch />}
        </button>
      </div>

      {error && <p className='error-message'>{error}</p>}

      {weather && weather.weather && (
        <div className='content'>
          <div className='weather-image'>
            <img
              className="flip-animate"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <h3 className='desc'>{weather.weather[0].description}</h3>
          </div>

          <div className='weather-temp flip-animate'>
            <h2>{Math.round(weather.main.temp)}<span>&deg;C</span></h2>
          </div>

          <div className='weather-city'>
            <div className='location'>
              <MdLocationOn />
            </div>
            <p>{weather.name}, <span>{weather.sys.country}</span></p>
          </div>

          <div className='weather-stats'>
            <div className='wind'>
              <div className='wind-icon'><FaWind /></div>
              <h3 className='wind-speed'>{weather.wind.speed}<span> Km/h</span></h3>
              <h3 className='wind-heading'>Wind Speed</h3>
            </div>
            <div className='humidity'>
              <div className='humidity-icon'><WiHumidity /></div>
              <h3 className='humidity-percent'>{weather.main.humidity}<span>%</span></h3>
              <h3 className='humidity-heading'>Humidity</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
