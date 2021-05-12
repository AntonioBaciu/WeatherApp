// Round value -> ex: 15.70 -> 16
function roundNum(number) {
  number = Math.round(number);
  return number;
}

// Funtion that creates an array of the next specified number of days
// Created using moment js
function nextDays(daysRequired) {
  let days = [];
  for (let i = 1; i <= daysRequired; i++) {
    days.push(moment().add(i, "days").format("dddd"));
  }
  return days;
}

// Event listener function [click & enter]
function init() {
  const cityName = document.getElementById("input"); // Input field
  const runBTN = document.getElementById("run"); // Button
  cityName.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      getDays();
      getTemperature();
      getForecast();
      getIMG();
      getName();
      displayElement("flex");
    }
  });
  runBTN.addEventListener("click", () => {
    getDays();
    getTemperature();
    getForecast();
    getIMG();
    getName();
    displayElement("flex");
  });
}

// Average of array
function average(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) sum += array[i];
  return parseFloat(sum / array.length);
}

// Split array
function chunkArray(myArray, chunk_size) {
  var results = [];
  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }
  return results;
}

// Display next days
function getDays() {
  let testArray = nextDays(5);
  for (let i = 0; i < 5; i++) {
    document.getElementById(`day_${i}`).textContent = testArray[i];
  }
}

// Capitalize first letter of a string
function letterCap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Gets the input value, capitalize its first letter
//and dysplays it in the specified location
function getName() {
  const input = document.getElementById("input").value;
  document.getElementById("name").textContent = letterCap(input);
}

// All elements with class .hide are displayed as specified
function displayElement(type) {
  let el = document.querySelectorAll(".hide");

  for (let i = 0; i < el.length; i++) {
    const currentEl = el[i];
    currentEl.style.display = type;
  }
}

// Gets the current temperature in °C and round the value
const getTemperature = async () => {
  let { data } = await axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${
        document.getElementById("input").value
      }&appid=ba01b37bddc3f18f7f259c51e1c01e01&units=metric`
    )
    .catch(() => {
      displayElement("none");
    });
  const current_temp = document.getElementById("current_temp"); // Current temperature
  const temperature = roundNum(data.main.temp);
  current_temp.textContent = `${temperature} °C`;

  // Gets the info values from the API
  const infoVals = Object.values(data.main);

  // Asigns each value to specified location
  for (let i = 1; i < 6; i++) {
    const info = document.getElementById(`info_${i}`);
    info.textContent = `${infoVals[i]} °C`;
    if (i == 5) {
      info.textContent = `${infoVals[i]}%`;
    } else if (i == 4) {
      info.textContent = `${infoVals[i]} hPa`;
    }
  }
};

// 5 days forecast
const getForecast = async () => {
  let { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${
      document.getElementById("input").value
    }&appid=ba01b37bddc3f18f7f259c51e1c01e01&units=metric`
  );
  // Store 5 days temperatures in one array
  const tempsArray = [];
  for (let i = 0; i < 40; i++) {
    let daily_temps = roundNum(data.list[i].main.temp); // Round temperatures
    tempsArray.push(daily_temps);
  }

  // Split the array in 8 piece arrays
  const dayTemps = chunkArray(tempsArray, 8);
  const tempsArray_split = [];

  // Calculate the avg temperature for each day
  for (let i = 0; i < dayTemps.length; i++) {
    let dayTemperature = roundNum(average(dayTemps[i]));
    tempsArray_split.push(dayTemperature);
  }
  // Assigns every average temperature to the coresponding location in the table
  for (let i = 0; i < tempsArray_split.length; i++) {
    document.getElementById(
      `index_${i}`
    ).textContent = ` ${tempsArray_split[i]} °C`;
  }
};

// Access Unsplash API

const getIMG = async () => {
  const inputKeyword = document.getElementById("input").value;
  const api_url = `https://api.unsplash.com/search/photos?query=${inputKeyword}%20building&client_id=_OqqlHbIl1ubFU376wBbyp3g8vG0MoZrqVda1ESGLII&orientation=landscape`;
  let { data } = await axios.get(api_url);
  const sourceIMG = data.results[0].urls.small;
  document.getElementById("image").src = sourceIMG;
};

// When everything is loaded, call init
init();
