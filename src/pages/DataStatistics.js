import './DataStatistics.css';
import DataBox from '../components/DataBox';
import Graph from '../components/Graph';
import useDataBox from '../hooks/useDataBox';

const DataStatistics = () => {
  const temp = useDataBox('');
  const hum = useDataBox('');
  const co2 = useDataBox('');
  const solar = useDataBox('');
  //알맞은 api 주소 입력
  return (
    <div className="dataStatistics">
      <div className="dataBoxGrid">
        <DataBox title="온도°C" average={temp.average} highest={temp.highest} lowest={temp.lowest}>
          <Graph data={temp.data} title="온도°C" label="온도" color="#87ceeB" />
        </DataBox>
        <DataBox title="습도 %" average={hum.average} highest={hum.highest} lowest={hum.lowest}>
          <Graph data={hum.data} title="습도 %" label="습도" color="#87ceeB" />
        </DataBox>
       {/* <DataBox title="CO₂ (ppm)" average={co2.average} highest={co2.highest} lowest={co2.lowest}>
          <Graph data={co2.data} title="CO₂ (ppm)" label="CO₂" color="#87ceeB" />
        </DataBox>
        <DataBox title="일사량 kWh/㎡" average={solar.average} highest={solar.highest} lowest={solar.lowest}>
          <Graph data={solar.data} title="일사량 kWh/㎡" label="일사량" color="#87ceeB" />
        </DataBox>*/}
      </div>
    </div>
  );
};

export default DataStatistics;
