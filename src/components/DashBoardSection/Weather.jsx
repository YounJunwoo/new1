import React from "react";
import useWeather from '../../hooks/useWeather';
import "./Weather.css";
import Forecast from "./Forecast";

const CITY = "Gyeongsan";

const Weather = () => {
  const { weather,loading,error } = useWeather(CITY);
  
  if (loading) console.log("로딩");
  if (error) console.log("에러");
  if (!weather) console.log("데이터 없음");


  const temp = weather?.main?.temp != null ? `${Math.round(weather.main.temp)}°C` : "-";
  const tempMin = weather?.main?.temp_min != null ? `${Math.round(weather.main.temp_min)}°C` : "-";
  const tempMax = weather?.main?.temp_max != null ? `${Math.round(weather.main.temp_max)}°C` : "-";
  const humidity = weather?.main?.humidity != null ? `${weather.main.humidity}%` : "-";
  const pressure = weather?.main?.pressure != null ? `${weather.main.pressure} hPa` : "-";

  const windSpeed = weather?.wind?.speed != null ? `${weather.wind.speed} m/s` : "-";
  const windDir = weather?.wind?.direction ?? "-";

  const cloudiness = weather?.clouds?.all != null ? `${weather.clouds.all}%` : "-";
  const sunrise = weather?.sys?.sunrise ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString() : "-";
  const sunset = weather?.sys?.sunset ? new Date(weather.sys.sunset * 1000).toLocaleTimeString() : "-";

  const description = weather?.weather?.[0]?.description ?? "-";
  const iconCode = weather?.weather?.[0]?.icon;
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : "";

  return (
    <>
      <div className="weather">
        <div className="overlap-5">
          <div className="overlap-6">
            <div className="weather-topic">날씨</div>
            <div className="weather-main-row">
              <div className="weather-info">
                <div className="city-name">{CITY}</div>
                <div className="city-temp-row">
                  {iconUrl && <img className="weather-icon" src={iconUrl} alt={description} />}
                  <div className="temp-description-layout">
                    <span className="temperature">{temp}</span>
                    <div className="weather-description">{description}</div>
                  </div>
                </div>
              </div>
              <div className="weather-layout-container">
                <div className="weather-layout">
                  <div className="weather-sub-topic"><span className="weather-sub-topic-label">최고 기온</span><span className="data">{tempMax}</span></div>
                  <div className="weather-sub-topic"><span className="weather-sub-topic-label">최저 기온</span><span className="data">{tempMin}</span></div>
                </div>
                <div className="weather-layout">
                  <div className="weather-sub-topic"><span className="weather-sub-topic-label">풍속</span><span className="data">{windSpeed}</span></div>
                  <div className="weather-sub-topic"><span className="weather-sub-topic-label">풍향</span><span className="data">{windDir}</span></div>
                </div>
                <div className="weather-layout">
                  <div className="weather-sub-topic"><span className="weather-sub-topic-label">습도</span><span className="data">{humidity}</span></div>
                  <div className="weather-sub-topic"><span className="weather-sub-topic-label">구름량</span><span className="data">{cloudiness}</span></div>
                </div>
                <div className="weather-layout">
                  <div className="weather-sub-topic"><span className="weather-sub-topic-label">일출</span><span className="data">{sunrise}</span></div>
                  <div className="weather-sub-topic"><span className="weather-sub-topic-label">일몰</span><span className="data">{sunset}</span></div>
                </div>
                <div className="weather-layout">
                  <div className="weather-sub-topic"><span className="weather-sub-topic-label">기압</span><span className="data">{pressure}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Forecast city={CITY} />
    </>
  );
};
export default Weather;
