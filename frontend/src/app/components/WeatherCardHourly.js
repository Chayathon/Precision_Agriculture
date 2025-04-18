import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { WiHumidity, WiDaySunny, WiDayCloudy, WiCloud, WiCloudy, WiDayShowers, WiDayRain, WiDayRainWind, WiDayThunderstorm, WiCloudyWindy, WiCloudyGusts, WiDayCloudyGusts, WiNa, WiNightCloudy, WiNightAltCloudy, WiNightShowers, WiNightRain, WiNightRainWind, WiNightThunderstorm, WiNightAltCloudyWindy, WiNightAltCloudyGusts, WiNightCloudyGusts, WiNightClear } from "react-icons/wi";
import { FaTemperatureHalf } from "react-icons/fa6";
import moment from 'moment';
import 'moment/locale/th';

const WeatherCardHourly = ({ time, temp, humid, rainChance, windSpeed, condition }) => {
  moment.locale('th');
  const date = moment(time).format('Do MMM');
  const hour = moment(time).format('HH');

  const weatherCondition = (conditionCode, time) => {
    const isNight = time > 18 || time < 6;

    if (isNight) {
      switch (conditionCode) {
        case 1:
          return <WiNightCloudy size={40} />;
        case 2:
          return <WiNightAltCloudy size={40} />;
        case 3:
          return <WiNightAltCloudy size={40} />;
        case 4:
          return <WiCloudy size={40} />;
        case 5:
          return <WiNightShowers size={40} />;
        case 6:
          return <WiNightRain size={40} />;
        case 7:
          return <WiNightRainWind size={40} />;
        case 8:
          return <WiNightThunderstorm size={40} />;
        case 9:
          return <WiNightAltCloudyWindy size={40} />;
        case 10:
          return <WiNightAltCloudyGusts size={40} />;
        case 11:
          return <WiNightCloudyGusts size={40} />;
        case 12:
          return <WiNightClear size={40} />;
        default:
          return <WiNa size={40} />;
      }
    } else {
      switch (conditionCode) {
        case 1:
            return <WiDayCloudy size={40} />;
        case 2:
            return <WiCloud size={40} />;
        case 3:
            return <WiCloud size={40} />;
        case 4:
            return <WiCloudy size={40} />;
        case 5:
            return <WiDayShowers size={40} />;
        case 6:
            return <WiDayRain size={40} />;
        case 7:
            return <WiDayRainWind size={40} />;
        case 8:
            return <WiDayThunderstorm size={40} />;
        case 9:
            return <WiCloudyWindy size={40} />;
        case 10:
            return <WiCloudyGusts size={40} />;
        case 11:
            return <WiDayCloudyGusts size={40} />;
        case 12:
            return <WiDaySunny size={40} />;
        default:
            return <WiNa size={40} />;
      }
    }
  };

  return (
    <Card className="w-40 mx-2 dark:bg-zinc-800">
      <CardHeader className="flex flex-col items-center">
        <p className="text-sm font-bold">{date}</p>
        <p className="text-sm">{hour}:00 น.</p>
      </CardHeader>
      <CardBody className="flex flex-col items-center">
        {weatherCondition(condition, hour)}

        <div className="flex space-x-2 mt-2">
          <p className="flex text-lg font-bold items-center"><FaTemperatureHalf size={18} className="text-red-500" />{Math.round(temp)}° &nbsp; <WiHumidity size={26} className="text-blue-500" />{Math.round(humid)}%</p>
        </div>

        <p className="text-sm mt-1">ฝน {rainChance}% ของพื้นที่</p>
        <p className="text-sm">ลม {windSpeed} ม./วินาที</p>
      </CardBody>
    </Card>
  );
};

export default WeatherCardHourly;