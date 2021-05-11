// Round value -> ex: 15.70 -> 16
function roundTemp(temp) {
  temp = Math.round(temp);
  return temp;
}

// Event listener function [click & enter]
function init() {
  const cityName = document.getElementById("input"); // Input field
  const runBTN = document.getElementById("run"); // Button
  cityName.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      getTemperature();
      getForecast();
      getIMG();
    }
  });
  runBTN.addEventListener("click", () => {
    getTemperature();
    getForecast();
    getIMG();
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

// Gets the current temperature in °C and round the value
const getTemperature = async () => {
  let { data } = await axios
    .get(
      `http://api.openweathermap.org/data/2.5/weather?q=${
        document.getElementById("input").value
      }&appid=ba01b37bddc3f18f7f259c51e1c01e01&units=metric`
    )
    .catch(() => {
      alert("Invalid City Name");
    });
  const current_temp = document.getElementById("current_temp"); // Current temperature
  const temperature = roundTemp(data.main.temp);
  current_temp.textContent = `${temperature} °C`;
};

// 5 days forecast
const getForecast = async () => {
  let { data } = await axios.get(
    `http://api.openweathermap.org/data/2.5/forecast?q=${
      document.getElementById("input").value
    }&appid=ba01b37bddc3f18f7f259c51e1c01e01&units=metric`
  );
  // Store 5 days temperatures in one array
  const tempsArray = [];
  for (let i = 0; i < 40; i++) {
    let daily_temps = roundTemp(data.list[i].main.temp); // Round temperatures
    tempsArray.push(daily_temps);
  }

  // Split the array in 8 piece arrays
  const dayTemps = chunkArray(tempsArray, 8);
  const tempsArray_split = [];

  // Calculate the avg temperature for each day
  for (let i = 0; i < dayTemps.length; i++) {
    let dayTemperature = roundTemp(average(dayTemps[i]));
    tempsArray_split.push(dayTemperature);
  }
  // Assigns every average temperature to the coresponding location in the table
  for (let i = 0; i < tempsArray_split.length; i++) {
    document.getElementById(
      `index_${i}`
    ).textContent = `${tempsArray_split[i]} °C`;
  }
};

// Access Unsplash API

const getIMG = async () => {
  const inputKeyword = document.getElementById("input");
  const api_url = `https://api.unsplash.com/search/photos?query=${inputKeyword}%20building&client_id=_OqqlHbIl1ubFU376wBbyp3g8vG0MoZrqVda1ESGLII`;
  let { data } = await axios.get(api_url);
  document.getElementById("image").src = api_url;
};

// When everything is loaded, call init
init();

// Unsplash API URL:
//https://api.unsplash.com/search/photos?query=london&client_id=_OqqlHbIl1ubFU376wBbyp3g8vG0MoZrqVda1ESGLII
//https://api.unsplash.com/search/photos?query=knokke%20building&client_id=_OqqlHbIl1ubFU376wBbyp3g8vG0MoZrqVda1ESGLII
