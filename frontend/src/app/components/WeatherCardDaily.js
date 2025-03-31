import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { WiThermometer, WiHumidity, WiDaySunny, WiDayCloudy, WiCloud, WiCloudy, WiDayShowers, WiDayRain, WiDayRainWind, WiDayThunderstorm, WiCloudyWindy, WiCloudyGusts, WiDayCloudyGusts, WiNa } from "react-icons/wi";
import moment from 'moment';
import 'moment/locale/th';

const WeatherCardDaily = ({ time, tempMax, tempMin, humid, rainChance, windSpeed, condition }) => {
    moment.locale('th');
    const date = moment(time).format('Do MMM');

    const weatherCondition = (conditionCode) => {
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
    };

    return (
        <Card className="w-40 mx-2">
            <CardHeader className="flex flex-col items-center">
                <p className="text-sm font-bold">{date}</p>
            </CardHeader>
            <CardBody className="flex flex-col items-center">
                {weatherCondition(condition)}

                <div className="flex space-x-2 mt-2">
                    <p className="flex text-lg font-bold"><WiThermometer size={26} className="text-red-500" />{Math.round(tempMax)}° <WiThermometer size={26} className="text-blue-500" />{Math.round(tempMin)}°</p>
                </div>
                <div className="flex space-x-2 mt-2">
                    <p className="flex text-lg font-bold"><WiHumidity size={26} className="text-blue-500" />{Math.round(humid)}%</p>
                </div>

                <p className="text-sm mt-1">ฝน {rainChance}% ของพื้นที่</p>
                <p className="text-sm">ลม {windSpeed} ม./วินาที</p>
            </CardBody>
        </Card>
    );
};

export default WeatherCardDaily;