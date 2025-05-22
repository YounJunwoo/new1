// 실시간 센서값 가져오기, pollingInterval, threshold 설정 필요
import { useState, useEffect, useCallback, useMemo } from "react";
function useSensorMonitor(warningNotification, pollingInterval = 5000) {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
//각센서의 api url과 임계치 설정
  const sensors = useMemo(() => [
    { key: 'temperature', label: '온도', unit: '°C', url: '', threshold: '' },
    { key: 'humidity', label: '습도', unit: '%', url: '', threshold: '' },
    { key: 'soil', label: '토양습도', unit: '', url: '', type: 'boolean' },
    { key: 'light', label: '일사량', unit: 'wh/㎡', url: '', threshold: '' },
    { key: 'water', label: '물통칸', unit: '%', url: '', type: 'boolean' },
  ], []);

  const fetchAllSensorData = useCallback(async () => {
    try {
      const results = await Promise.all(
        sensors.map(async (sensor) => {
          const response = await fetch(sensor.url); //센서 api 삽입
          const data = await response.json();
          const value = data.value;
          if (sensor.type === 'boolean') {
            if (value === 'true') return { [sensor.key]:value ? 'ON' : 'OFF' };
          }
          if (value > sensor.threshold) {
            warningNotification(`${sensor.label} 임계치 초과`, {
              body: `현재 ${sensor.label}는 ${value}${sensor.unit}입니다.`,
            });
          }

          return { [sensor.key]: value };
        })
      );
      const mergedData = Object.assign({}, ...results);
      setSensorData(mergedData);
    } catch (error) {
      console.error("센서 데이터 불러오기 실패:", error);
    } finally {
      setLoading(false); 
    }
  }, [sensors, warningNotification]);
  
  //마운트할 떄 데이터 fetch와 pollingInterval 간격으로 데이터 재요청
  useEffect(() => {
    fetchAllSensorData();
    const interval = setInterval(fetchAllSensorData, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchAllSensorData, pollingInterval]);

  return { sensorData, loading };
}

export default useSensorMonitor;
