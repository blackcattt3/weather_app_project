import { useState } from 'react'
import { useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import WeatherBox from './component/WeatherBox'
import WeatherButton from './component/WeatherButton'
import { ClipLoader } from "react-spinners";


function App() {

  const apiKey = import.meta.env.VITE_API_KEY;;
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [backgroundImageId, setBackgroundImageId] = useState("");
  const [weatherGroup, setWeatherGroup] = useState("");
  // const [loading, setLoading] = useState(true);
  const cities=["Seoul","Tokyo", "Iceland", "Paris", "New york"];
  const [status, setStatus] = useState('loading')
  


  useEffect(()=>{
    if(city === "" || city === null){
      getCurrentLocation();
    } else{
      getWeatherByButton(city)
    }
  }, [city]);


  const handleChangeCity = (city)=>{
    if(city === "current"){
      setCity(null)
    } else{
      setCity(city)
    }
  }

  const getCurrentLocation = ()=>{
    // setLoading(true);
    setStatus('loading');

    const fallbackTimer = setTimeout(() => {
    console.log("⏱️ geo slow -> fallback to Seoul");
    setStatus('fallback');
    getWeatherByButton("Seoul"); // ✅ 기본 도시로 먼저 보여주기
  }, 3000); // 6초 정도 추천

    navigator.geolocation.getCurrentPosition((position) => {
        clearTimeout(fallbackTimer);
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        getCurrentLocationWeather(lat, long);
        // console.log("lat",lat, "long", long);
    },
    (err) => {
      clearTimeout(fallbackTimer);
      console.log("geo error:", {code: err.code, message: err.message});
      setStatus('fallback');
      getWeatherByButton("Seoul"); // ✅ 권한 실패면 기본 도시
    },
    { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 }
    );
  }

  const getCurrentLocationWeather = async (lat, long)=>{
    let url = new URL(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&lang=kr&appid=${apiKey}`);
    setStatus('loading');

    try{
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || (data?.cod && String(data.cod) !== "200")) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      setWeather(data);
      setBackgroundImageId(data.weather[0].id);
      setWeatherGroup(classifyWeatherGroup(data.weather[0].id));
      setStatus('success');
    } catch (e){
      console.log("weather error:", e);
      setStatus('error');
    }

    // const response = await fetch(url);
    // const data = await response.json();

    // console.log("status", response.status);
    // console.log("ok", response.ok);
    // console.log("data", data);




    // setWeather(data);
    // setBackgroundImageId(data.weather[0].id);
    // setWeatherGroup(classifyWeatherGroup(data.weather[0].id));
    // setLoading(false);
    // console.log(data);
    // console.log("bgi", backgroundImageId);
    // console.log(weatherGroup);
  }
  
  const getWeatherByButton = async (city)=>{
    let url = new URL(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=kr&appid=${apiKey}`)
    setStatus('loading');

    try{
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || (data?.cod && String(data.cod) !== "200")) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }
      setWeather(data);
      setBackgroundImageId(data.weather[0].id);
      setWeatherGroup(classifyWeatherGroup(data.weather[0].id));
      setStatus('success');
    } catch (e) {
      console.log("weather error:", e);
      setStatus('error');
    }


    // console.log("status", response.status);
    // console.log("ok", response.ok);
    // console.log("data", data);


    // setWeather(data);
    // setBackgroundImageId(data.weather[0].id);
    // setWeatherGroup(classifyWeatherGroup(data.weather[0].id));
    // setStatus('success');
    // console.log(data);
    // console.log("bgi",backgroundImageId);
    // console.log(weatherGroup);
  }

  const classifyWeatherGroup = (backgroundImageId)=>{
    if(backgroundImageId>=200 && backgroundImageId<=299) return "Thunderstorm"
    if(backgroundImageId>=300 && backgroundImageId<=399) return "Drizzle"
    if(backgroundImageId>=500 && backgroundImageId<=599) return "Rain"
    if(backgroundImageId>=600 && backgroundImageId<=699) return "Snow"
    if(backgroundImageId>=700 && backgroundImageId<=799) return "Mist"
    if(backgroundImageId == 800) return "Clear"
    if(backgroundImageId>=801 && backgroundImageId<=899) return "Clouds"
    // if(backgroundImageId>=200 && backgroundImageId<=299){
    //   return "Thunderstorm"
    // } else if(backgroundImageId>=300 && backgroundImageId<=399){
    //   return "Drizzle"
    // } else if(backgroundImageId>=500 && backgroundImageId<=599){
    //   return "Rain"
    // } else if(backgroundImageId>=600 && backgroundImageId<=699){
    //   return "Snow"
    // } else if(backgroundImageId>=700 && backgroundImageId<=799){
    //   return "Mist"
    // } else if(backgroundImageId == 800){
    //   return "Clear"
    // } else if(backgroundImageId>=801 && backgroundImageId<=899){
    //   return "Clouds"
    // }
    
  }
  return (
    <div>
      {/* {loading? <div className={`wrapper ${weatherGroup}`}>
      <ClipLoader color='black' loading={loading} size={150}/></div>
      : <div className={`wrapper ${weatherGroup}`}>
      {weather && <WeatherBox weather={weather} backgroundImageId={backgroundImageId}/>}
        <WeatherButton cities={cities} setCity={setCity} selectedCity={city} handleChangeCity={handleChangeCity}/>
      </div>} */}
      {(status === 'loading' || status === 'fallback') ? (
      <div className={`wrapper ${weatherGroup}`}>
        <ClipLoader color='black' loading={true} size={150}/>
        {status === 'fallback' && (
          <p style={{ marginTop: 12 }}>위치 응답이 지연되어 기본 도시(Seoul)로 표시 중…</p>
        )}
      </div>
    ) : status === 'error' ? (
      <div className="loading-screen">
        <h2>‼️ 날씨 정보를 불러오지 못했습니다 ‼️</h2>
        <button onClick={getCurrentLocation}>다시 시도</button>
      </div>
    ) : (
      <div className={`wrapper ${weatherGroup}`}>
        {weather && <WeatherBox weather={weather} backgroundImageId={backgroundImageId}/>}
        <WeatherButton cities={cities} setCity={setCity} selectedCity={city} handleChangeCity={handleChangeCity}/>
      </div>
    )}
    </div>
  
  )
}

export default App

// cities에 따라 버튼 누르면 각각의 날씨 보여주기
// current Location버튼 누르면 현재위치의 날씨 보여주기
// current Location, new York, tokyo, iceland
// 로딩스피너
// 날씨에 따라 배경화면 다르게 보여주기 (해, 비, 구름, 눈)
// weather.id 에 따라서 클래스를 다르게 줘서 각 클래스에 해당하는 이미지 띄우기.