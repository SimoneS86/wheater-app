import { useState, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import logo from "../Img/logo.png";

const MyMeteo = () => {
  const [geo, setGeo] = useState(null);
  const [weather, setWeather] = useState([]);
  const [nextWeather, setNextWeather] = useState([]);
  const [query, setQuery] = useState("");
  const handlechange = (e) => {
    setQuery(e.target.value);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    geoFetch();
  };

  useEffect(() => {
    if(geo) {
      currentMeteo();
      nextMeteo();
    }
  }, [geo]);

  const key = "5f5454f592ba4beacf8be6d257672a2b";
  const geoFetch = async () => {
    try {
      const Url = "http://api.openweathermap.org/geo/1.0/direct?q=" + query + "&appid=" + key;
      const resp = await fetch(Url);
      if (resp.ok) {
        const data = await resp.json();
        setGeo(data[0]);
      }
    } catch (err) {
      console.log("qualcosa è andato storto!");
    }
  };

  const currentMeteo = async () => {
    try {
      const weatherFetch = `https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&units=metric&appid=${key}`
      const resp = await fetch(weatherFetch);
      if (resp.ok) {
        const data = await resp.json();
        setWeather(data);
      }
    } catch (error) {
      console.log("qualcosa è andato storto!");
    }
  };

  const nextMeteo = async () => {
    try {
      const forecastFetch = `https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&units=metric&appid=${key}`;
      const resp = await fetch(forecastFetch);
      if (resp.ok) {
        const data = await resp.json();
        setNextWeather(data);
      }
    } catch (err) {
      console.log("qualcosa è andato storto!");
    }
  };
 
  return (
    <div className="container">
      <Row >
        <Col  xm={6} className="logo">
          <div className=" d-flex  mt-5">
            <img src={logo} alt="page-logo" width={100} height={100} />
            <h1 className="mt-4 mb-3 ms-3">MyMeteo</h1>
          </div>
          <div className=" my-4">
            <Form onSubmit={handlesubmit}>   
              <Form.Control
                type="text"
                placeholder="Cerca Località"
                value={query}
                onChange={handlechange}
              />
            </Form>
          </div>
        </Col>
        <Col  xm={6}>
          <div className="mt-5 d-flex flex-column hero align-items-center text-center">
            {weather.name ? <h3 className="fw-bold fs-1 mb-2">{weather.name}</h3> : null}
            {weather.main ? (
              <p >{weather.main.temp}&#176;C</p>
            ) : null}
            {weather.weather ? (
              <p >{weather.weather[0].description}</p>
            ) : null}
         </div>
          
        </Col>
      </Row>
      <Row>
      {nextWeather.list && (
        <div className="list-group mt-4 ">
          {nextWeather.list.map((day, i) => (
            <div key={i} className="d-flex flex-row justify-content-between align-items-center border border-info rounded my-2 p-2 ">
              <span className="text-start fs-6 w-30">{day.dt_txt}</span>
              <span className=" text-center fs-4">
              {day.weather[0].description}
              </span>
              <span className=" fs-6 text-end w-30">
              {day.main.temp}&#176;C
              </span>
            </div>
          ))}
        </div>
      )}
      </Row>

    </div>
  )
}

export default MyMeteo;