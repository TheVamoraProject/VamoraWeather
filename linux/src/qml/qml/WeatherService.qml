import QtQuick
import QtCore

QtObject {
    id: root

    property Settings stored: Settings {
        id: storedObj
        category: "VamoraWeather"
        property string tempUnit: "°C"
        property string cityName: ""
        property string country: ""
        property real latitude: 9999    // sentinel: no city chosen yet
        property real longitude: 9999
        property bool notificationsEnabled: true
        property string theme: "Auto"   // "Auto" | "Dark" | "Light"
    }

    // ── persisted state (auto-saved by Settings) ──────────────────
    property alias tempUnit: storedObj.tempUnit                 // "°C" | "°F"
    property alias cityName: storedObj.cityName
    property alias country: storedObj.country
    property alias latitude: storedObj.latitude
    property alias longitude: storedObj.longitude
    property alias notificationsEnabled: storedObj.notificationsEnabled
    property alias theme: storedObj.theme

    property bool loading: false
    property string error: ""
    property string updatedTime: ""
    property bool isDay: false
    property string conditionLabel: "—"
    property real tempC: 0
    property real feelsLikeC: 0
    property int humidity: 0
    property real windKmh: 0
    property real visibilityKm: 0
    property real todayHigh: 0
    property real todayLow: 0
    property var hourly: []   // { time, temp (°C), icon }
    property var daily: []    // { day, high (°C), low (°C), icon, label }

    function toTemp(c) {
        if (root.tempUnit === "°F")
            return Math.round(c * 9 / 5 + 32);
        return Math.round(c);
    }

    function toggleTempUnit() {
        root.tempUnit = root.tempUnit === "°C" ? "°F" : "°C";
    }

    function toggleNotifications() {
        root.notificationsEnabled = !root.notificationsEnabled;
    }

    // Appearance: Auto (follows real day/night) -> Dark -> Light.
    function cycleTheme() {
        if (root.theme === "Auto")
            root.theme = "Dark";
        else if (root.theme === "Dark")
            root.theme = "Light";
        else
            root.theme = "Auto";
    }

    function labelFor(code) {
        switch (code) {
        case 0:  return "Clear sky";
        case 1:  return "Mainly clear";
        case 2:  return "Partly cloudy";
        case 3:  return "Overcast";
        case 45: case 48: return "Fog";
        case 51: return "Light drizzle";
        case 53: return "Drizzle";
        case 55: return "Dense drizzle";
        case 56: case 57: return "Freezing drizzle";
        case 61: return "Light rain";
        case 63: return "Rain";
        case 65: return "Heavy rain";
        case 66: case 67: return "Freezing rain";
        case 71: return "Light snow";
        case 73: return "Snow";
        case 75: return "Heavy snow";
        case 77: return "Snow grains";
        case 80: return "Light showers";
        case 81: return "Showers";
        case 82: return "Heavy showers";
        case 85: case 86: return "Snow showers";
        case 95: return "Thunderstorm";
        case 96: case 99: return "Storm with hail";
        default: return "—";
        }
    }

    function iconFor(code, day) {
        if (code === 0 || code === 1)
            return day ? "sun" : "moon";
        if (code === 2)
            return day ? "cloud-sun" : "cloud";
        if (code === 51 || code === 53 || code === 55 || code === 56
                || code === 57 || code === 61 || code === 63 || code === 65
                || code === 66 || code === 67 || code === 80 || code === 81
                || code === 82 || code === 95 || code === 96 || code === 99)
            return "cloud-rain";
        return "cloud";
    }

    function refresh() {
        if (root.latitude > 9000 || root.loading)
            return;
        root.loading = true;
        root.error = "";

        var url = "https://api.open-meteo.com/v1/forecast"
            + "?latitude=" + root.latitude
            + "&longitude=" + root.longitude
            + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,visibility"
            + "&hourly=temperature_2m,weather_code,is_day"
            + "&daily=weather_code,temperature_2m_max,temperature_2m_min"
            + "&timezone=auto&forecast_days=6&wind_speed_unit=kmh";

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== XMLHttpRequest.DONE)
                return;
            root.loading = false;
            if (xhr.status !== 200) {
                root.error = "Couldn't reach the weather service (HTTP " + xhr.status + ").";
                return;
            }
            try {
                applyForecast(JSON.parse(xhr.responseText));
            } catch (e) {
                root.error = "Couldn't parse the weather response.";
            }
        };
        xhr.onerror = function() {
            root.loading = false;
            root.error = "Network error — check your connection.";
        };
        xhr.open("GET", url);
        xhr.send();
    }

    function applyForecast(data) {
        var cur = data.current;
        var dayFlag = cur.is_day === 1;

        root.isDay = dayFlag;
        root.conditionLabel = labelFor(cur.weather_code);
        root.tempC = cur.temperature_2m;
        root.feelsLikeC = cur.apparent_temperature;
        root.humidity = cur.relative_humidity_2m;
        root.windKmh = Math.round(cur.wind_speed_10m);
        root.visibilityKm = Math.round((cur.visibility || 0) / 100) / 10;
        root.updatedTime = String(cur.time).slice(11, 16);

        // Hourly: 9 entries starting at the current hour.
        var hours = [];
        var times = data.hourly.time;
        var prefix = String(cur.time).slice(0, 13);
        var start = 0;
        for (var i = 0; i < times.length; i++) {
            if (String(times[i]).slice(0, 13) >= prefix) {
                start = i;
                break;
            }
        }
        for (var h = start; h < Math.min(start + 9, times.length); h++) {
            var hDay = data.hourly.is_day[h] === 1;
            hours.push({
                time: h === start ? "Now" : String(times[h]).slice(11, 16),
                temp: data.hourly.temperature_2m[h],
                icon: iconFor(data.hourly.weather_code[h], hDay)
            });
        }
        root.hourly = hours;

        // Daily: 6 days, first row is "Today".
        var days = [];
        var names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (var d = 0; d < data.daily.time.length; d++) {
            var parts = String(data.daily.time[d]).split("-");
            var date = new Date(parts[0], parts[1] - 1, parts[2]);
            var code = data.daily.weather_code[d];
            days.push({
                day: d === 0 ? "Today" : names[date.getDay()],
                high: data.daily.temperature_2m_max[d],
                low: data.daily.temperature_2m_min[d],
                icon: iconFor(code, true),
                label: labelFor(code)
            });
        }
        root.daily = days;
        root.todayHigh = days.length > 0 ? days[0].high : 0;
        root.todayLow = days.length > 0 ? days[0].low : 0;
    }

    // cb receives [{ name, detail, latitude, longitude, country }].
    function searchCity(query, cb) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== XMLHttpRequest.DONE)
                return;
            var out = [];
            if (xhr.status === 200) {
                try {
                    var res = JSON.parse(xhr.responseText).results || [];
                    for (var i = 0; i < res.length; i++) {
                        var r = res[i];
                        var sub = (r.admin1 ? r.admin1 + ", " : "") + (r.country || "");
                        out.push({
                            name: r.name,
                            detail: sub,
                            latitude: r.latitude,
                            longitude: r.longitude,
                            country: r.country || ""
                        });
                    }
                } catch (e) {}
            }
            cb(out);
        };
        xhr.open("GET", "https://geocoding-api.open-meteo.com/v1/search?name="
                 + encodeURIComponent(query) + "&count=6&language=en&format=json");
        xhr.send();
    }

    function setCity(name, countryName, lat, lon) {
        root.cityName = name;
        root.country = countryName;
        root.latitude = lat;
        root.longitude = lon;
        refresh();
    }

    function detectLocation() {
        root.loading = true;
        root.error = "";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== XMLHttpRequest.DONE)
                return;
            var ok = false;
            if (xhr.status === 200) {
                try {
                    var loc = JSON.parse(xhr.responseText);
                    if (loc.status === "success") {
                        root.cityName = loc.city || loc.regionName || "My location";
                        root.country = loc.country || "";
                        root.latitude = loc.lat;
                        root.longitude = loc.lon;
                        ok = true;
                    }
                } catch (e) {}
            }
            if (!ok && root.latitude > 9000) {
                // Offline / lookup failed on first run: fall back to London.
                root.cityName = "London";
                root.country = "United Kingdom";
                root.latitude = 51.5074;
                root.longitude = -0.1278;
            }
            root.loading = false;
            refresh();
        };
        xhr.onerror = function() {
            if (root.latitude > 9000) {
                root.cityName = "London";
                root.country = "United Kingdom";
                root.latitude = 51.5074;
                root.longitude = -0.1278;
            }
            root.loading = false;
            refresh();
        };
        xhr.open("GET", "http://ip-api.com/json/?fields=status,message,city,regionName,country,lat,lon");
        xhr.send();
    }

    property Timer autoRefresh: Timer {
        interval: 15 * 60 * 1000
        repeat: true
        running: true
        onTriggered: root.refresh()
    }

    Component.onCompleted: {
        if (root.latitude > 9000)
            detectLocation();
        else
            refresh();
    }
}
