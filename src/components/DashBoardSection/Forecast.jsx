import useForecast from '../../hooks/useForecast';
import './Forecast.css';

const Forecast = ({ city }) => {
  const { forecast, loading, error } = useForecast(city);

  if (loading) console.log("로딩");
  if (error) console.log("에러");
  if (!forecast.length) console.log("데이터 없음");

  return (
    <div className="forecast-container">
      <div className="forecast-list">
        {forecast.map((item) => (
          <div className="forecast-day" key={item.dt}>
            <div className="forecast-day-date">{item.dt_txt.slice(0, 10)}</div>
            <img className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
            />
            <div className="forecast-day-description">{item.weather[0].description}</div>
            <div className="forecast-day-max">최고 
              <span>{Math.round(item.main.temp_max)}°C</span></div>
            <div className="forecast-day-min">최저
              <span>{Math.round(item.main.temp_min)}°C</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;