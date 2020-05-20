const API_KEY = '34593f5074657fb9691a3a3460cc33ca';
const API_ONE_CALL_LINK = 'https://api.openweathermap.org/data/2.5/onecall';
const API_CURRENT_WEATHER_LINK = 'http://api.openweathermap.org/data/2.5/weather';

class App {
    constructor() {
        this.body = document.body.querySelector('.app');
        this.currentWeather = new CurrentWeather();
        this.dailyWeather = new DailyWeather();
        this.hourlyWeather = new HourlyWeather();
    }

    getWeatherInfo({ coords: { latitude, longitude } }) {
        let urls = [
            `${API_CURRENT_WEATHER_LINK}?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${API_KEY}&units=metric&lang=ru`,
            `${API_ONE_CALL_LINK}?lat=${latitude}&lon=${longitude}&exclude=current,minutely&appid=${API_KEY}&units=metric&lang=ru`
        ];

       return Promise.all(urls.map((url) => {
            return fetch(url)
            .then(response => response.json())
        }))
        .then(([current, {hourly, daily}]) => {
            return {
                current,
                hourly,
                daily
            }
        });
    }

    static getDateInfo(unixTimestamp) {
        let fullDate = new Date(unixTimestamp * 1000),
            days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            year = fullDate.getFullYear() < 10 ? '0' + fullDate.getFullYear() : fullDate.getFullYear(),
            month = fullDate.getMonth() < 10 ? '0' + fullDate.getMonth() : fullDate.getMonth(),
            date = fullDate.getDate() < 10 ? '0' + fullDate.getDate() : fullDate.getDate(),
            hour = fullDate.getHours() < 10 ? '0' + fullDate.getHours() : fullDate.getHours(),
            minutes = fullDate.getMinutes() < 10 ? '0' + fullDate.getMinutes() : fullDate.getMinutes();

        let dateString = `${date}.${month}.${year}`,
            dayString = days[fullDate.getDay()],
            timeString = `${hour}:${minutes}`;

            return {
                date: dateString,
                day: dayString,
                time: timeString 
            }
    }
}

class CurrentWeather {
    constructor() {
        this.body = document.querySelector('.current-weather');
        this.city = this.body.querySelector('.city-name');
        this.toodayInfo = this.body.querySelector('.tooday-info');
        this.icon = this.body.querySelector('.current-weather__main-image img');
        this.description = this.body.querySelector('.current-weather__description');
        this.temp = this.body.querySelector('.current-weather__temp');
    }
    
    showCurrentWeather(current) {
        this.city.innerText = current.name;
        this.icon.src = `img/${current.weather[0].icon}.png`;
        this.description.innerText = current.weather[0].description;
        this.temp.innerText = current.main.temp;

        let dateInfo = App.getDateInfo(current.dt);

        this.toodayInfo.querySelector('.tooday-info__day-name').innerText = dateInfo.day;
        this.toodayInfo.querySelector('.tooday-info__date').innerText = dateInfo.date;
        this.toodayInfo.querySelector('.tooday-info__time').innerText = dateInfo.time;
    }
}

class HourlyWeather {
    constructor() {
        this.body = document.querySelector('.hourly-weather');
        this.forecasts = this.body.querySelectorAll('.hourly-weather__carousel-item');
    }

    showHourlyWeather(hourly) {
        let forecastList = [];

        for (let i = 3; i <= 24; i += 3) {
            forecastList.push(hourly[i]);
        }

        [].forEach.call(this.forecasts, (elem, index) => {
            let weatherInfo = forecastList[index];

            elem.querySelector('img').src = `img/${weatherInfo.weather[0].icon}.png`;
            elem.querySelector('.hourly-weather__temp').innerText = Math.round(weatherInfo.temp);
            elem.querySelector('.hourly-weather__time').innerText = App.getDateInfo(weatherInfo.dt).time;
        })
    }
}

class DailyWeather {
    constructor() {
        this.body = document.querySelector('.daily-weather');
        this.forecasts = document.querySelectorAll('.daily-weather__carousel-item');
    }

    showDailyWeather(daily) {
        daily.shift();


        [].forEach.call(this.forecasts, (elem, index) => {
            let dateInfo = App.getDateInfo(daily[index].dt)
            
            elem.querySelector('img').src = `img/${daily[index].weather[0].icon}.png`;
            elem.querySelector('.daily-weather__day-name').innerText = dateInfo.day;
            elem.querySelector('.daily-weather__date').innerText = dateInfo.date;
            elem.querySelector('.daily-weather__temp-day-value').innerText = Math.round(daily[index].temp.day);
            elem.querySelector('.daily-weather__temp-night-value').innerText = Math.round(daily[index].temp.night);
        })
    }

}

const app = new App();

navigator.geolocation.getCurrentPosition((position) => {
    app.getWeatherInfo(position)
    .then(({ current, hourly, daily }) => {
        app.currentWeather.showCurrentWeather(current);
        app.dailyWeather.showDailyWeather(daily);
        app.hourlyWeather.showHourlyWeather(hourly);
    })
    .then(() => {
        const loader = document.body.querySelector('.pop-up__await-geolocation');
        let fadeLoader = setInterval(() => {
            if(getComputedStyle(loader).opacity > 0) {
                loader.style.opacity -= 0.05;
            } else if(getComputedStyle(loader).opacity <= 0) {
                loader.remove();
                clearInterval(fadeLoader);
            }
        }, 100);
    })

}, (error) => {
    const popUp = document.body.querySelector('.pop-up__await-geolocation');

    if(error.message == 'User denied Geolocation') {
        popUp.innerText = 'Запрос на определение местоположения отклонен. Обновите страницу и дайте разрешение в всплывающем окне.'
        return
    }
    popUp.innerText = `Не получилось определить местоположение. Ошибка: ${error.message}`
})

