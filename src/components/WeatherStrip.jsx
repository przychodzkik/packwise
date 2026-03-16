import { memo } from "react";
import { weatherEmoji } from "../constants/weather.js";
import { shortDay } from "../utils/date.js";

export const WeatherStrip = memo(function WeatherStrip({ leg, showCityTitle }) {
  return (
    <div className="weather-strip">
      <p className="weather-strip-title">
        {showCityTitle ? `${leg.geo.name}, ${leg.geo.country}` : "Prognoza pogody"}
      </p>
      <div className="weather-days">
        {leg.daily.time.map((t, j) => (
          <div key={t} className="weather-day">
            <div className="wd-label">{shortDay(t)}</div>
            <div className="wd-emoji" aria-hidden="true">
              {weatherEmoji(leg.daily.weather_code[j])}
            </div>
            <div className="wd-temps">
              <span className="wd-max">{Math.round(leg.daily.temperature_2m_max[j])}°</span>
              {" "}
              <span className="wd-min">{Math.round(leg.daily.temperature_2m_min[j])}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
