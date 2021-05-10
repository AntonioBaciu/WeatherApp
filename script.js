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
    }
  });
  runBTN.addEventListener("click", () => {
    getTemperature();
    getForecast();
  });
}

// Gets the current temperature in C and round the value
const getTemperature = async () => {
  const current_temp = document.getElementById("current_temp"); // Current temperature
  let { data } = await axios
    .get(
      `http://api.openweathermap.org/data/2.5/weather?q=${
        document.getElementById("input").value
      }&appid=ba01b37bddc3f18f7f259c51e1c01e01&units=metric`
    )
    .catch(() => {
      alert("Invalid City Name");
    });
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
  for (let i = 0; i < 8; i++) {
    let daily_temps = data.list[i].main.temp;
    console.log(daily_temps);
  }
  console.log(data.list);
  // Need to find a way to sort the data from data.list
};

// When everything is loaded, call init
init();

// 6, 14, 22, 30, 38
