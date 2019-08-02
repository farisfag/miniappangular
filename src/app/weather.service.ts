import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(public http: HttpClient) {

  }

  //return the entire weather data from the API of city name provided as a string
  getCityWeatherByName(city: string, metric: 'metric' | 'imperial' = 'metric'): Subject<string> {
    const dataSub = new Subject<string>();
    this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=473d59441f8c8796d7df36bafdccd6a7`
    ).subscribe((data) => {
      dataSub.next(data['weather']);
    }, (err) => {
      console.log(err);
    });
    return dataSub;
  }

  //returns the entire weather data from the API of the city names provided as an array
  getCitiesWeathersByNames(cities:Array<string>, metric : 'metric' | 'imperial' = 'metric'): Subject<any> {
    const citiesSubject = new Subject();
    cities.forEach((city) => {
      citiesSubject.next(this.http.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=473d59441f8c8796d7df36bafdccd6a7`));
    });
    return citiesSubject;
  }

  //the current weather state e.g. cloudy - clear
  getWeatherState(city:string): Subject<string> {
    const dataSubject = new Subject<string>();
    this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=473d59441f8c8796d7df36bafdccd6a7`)
    .subscribe((data) => {
      dataSubject.next(data['weather'][0].main);
    });
    return dataSubject;
  }

  //current temperature
  getCurrentTemp(city: string, metric: 'metric' | 'imperial' = 'metric'): Subject<number> {
    const dataSubject = new Subject<number>();
    this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=473d59441f8c8796d7df36bafdccd6a7`)
      .subscribe((weather: any) => {
        dataSubject.next(Math.round(Number(weather.main.temp)));
      });
      return dataSubject;
  }

  getCurrentHum(city: string, metric: 'metric' | 'imperial'= 'metric'): Subject<number> {
    const dataSubject = new Subject<number>();
    this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=473d59441f8c8796d7df36bafdccd6a7`)
      .subscribe((weather: any) => {
        console.log(weather);
        dataSubject.next(weather.main.humidity);
      });
      return dataSubject;
  }

  getCurrentWind(city: string, metric: 'metric' | 'imperial'= 'metric'): Subject<number> {
    const dataSubject = new Subject<number>();
    this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=473d59441f8c8796d7df36bafdccd6a7`)
      .subscribe((weather: any) => {
        dataSubject.next(Math.round(Math.round(weather.wind.speed)));
      });
      return dataSubject;
  }

  getMaxTemp(city: string, metric: 'metric' | 'imperial'= 'metric'): Subject<number> {
    const dataSubject = new Subject<number>();
    let max: number;
    this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=473d59441f8c8796d7df36bafdccd6a7`)
      .subscribe((weather: any) => {
        max = weather.list[0].main.temp;
        weather.list.forEach((value) => {
          if (max < value.main.temp) {
            max = value.main.temp;
          }
        });
        dataSubject.next(Math.round(max));
      });
      return dataSubject;
  } 

  getMiniTemp(city: string, metric: 'metric' | 'imperial'= 'metric'): Subject<number> {
    const dataSubject = new Subject<number>();
    let min: number;
    this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=473d59441f8c8796d7df36bafdccd6a7`)
      .subscribe((weather:any) => {
        min = weather.list[0].main.temp;
        weather.list.forEach((value) => {
          if (min > value.main.temp) {
            min = value.min.temp;
          }
        });
        dataSubject.next(Math.round(min));
      });
      return dataSubject;
  }

  //get weather data for the 5 upcoming days
  getForecast(city: string, metric: 'metric' | 'imperial'= 'metric'): Subject<Array<any>> {
    const dataSubject = new Subject<Array<any>>();
    this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=473d59441f8c8796d7df36bafdccd6a7`)
      .subscribe((weather:any) => {
        dataSubject.next(weather.list);
      });
      return dataSubject;
  }

}
