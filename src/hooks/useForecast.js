import { useEffect, useState } from 'react';

function hourToNum(hourStr) {
  return parseInt(hourStr.split(':')[0], 10);
}

const useForecast = (city) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    if (!API_KEY) {
      console.error('[useForecast] 날씨 API 키가 설정되지 않았습니다.');
      setLoading(false);
      return;
    }

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=kr`
        );

        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error('날씨 API 응답 파싱 중 오류가 발생했습니다.');
        }

        if (!res.ok) {
          throw new Error(data.message || '날씨 API 요청 중 오류가 발생했습니다.');
        }

        const dailyMap = {};
        data.list.forEach(item => {
          const date = item.dt_txt.slice(0, 10);
          const hour = item.dt_txt.slice(11, 19);
          if (
            !dailyMap[date] ||
            Math.abs(hourToNum(hour) - 18) < Math.abs(hourToNum(dailyMap[date].dt_txt.slice(11, 19)) - 18)
          ) {
            dailyMap[date] = item;
          }
        });

        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const sortedDates = Object.keys(dailyMap)
          .filter(date => date > today) // 오늘 제외
          .sort();

        const forecastList = sortedDates.slice(0, 5).map(date => dailyMap[date]);

        setForecast(forecastList);
      } catch (err) {
        console.error('[useForecast] 에러 발생:', err.message);
        setError(null);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city, API_KEY]);

  return { forecast, loading, error };
};

export default useForecast;
