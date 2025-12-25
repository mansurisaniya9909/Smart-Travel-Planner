const params = new URLSearchParams(window.location.search);

const city = params.get("city");

const cityName = document.getElementById("cityName");
const loading =document.querySelector("#loading");
const cityInfoBox =document.querySelector("#cityInfo");
const errorBox =document.querySelector("#error");

const lat =document.querySelector("#lat");
const lon =document.querySelector("#lon");
const country =document.querySelector("#country");
const state =document.querySelector("#state");
const population =document.querySelector("#population");

let GEODB_API_KEY ="ae541af394msh0462695a0ea88cdp1cd082jsn1e61cb56c0b2";
let GEODB_HOST = "wft-geo-db.p.rapidapi.com"

if(city){
    cityName.textContent = city;

    async function fetchCityDetails(cityName){
        try{
         let res =await fetch(`https://${GEODB_HOST}/v1/geo/cities?namePrefix=${city}&limit=1`,
            {
             method: "GET",
             headers: {
                "X-RapidAPI-Key":GEODB_API_KEY,
                "X-RapidAPI-Host":GEODB_HOST
             }   
            }
         );
         console.log(res);

         if(!res.ok){
            console.log("API Response Not Fetched....");
            
         }
         let data = await res.json();
         console.log(data);

         if(!data.data||data.data.length===0){
            console.log("City Not Found");
            
         }

         let cityData = data.data[0];
         console.log(cityData);
         

        //  Display City Info
         lat.textContent = cityData.latitude;
         lon.textContent = cityData.longitude;
         country.textContent = cityData.country;
         state.textContent = cityData.region || "N/A";
         population.textContent = cityData.population?cityData.population.toLocaleString():"N/A";

         loading.classList.add("hidden");
         cityInfoBox.classList.remove("hidden");
         
        } catch(error){
            console.log(error);
            loading.classList.add("hidden");
            errorBox.classList.remove("hidden");
            
        }
    }
    fetchCityDetails(city);
}else{
    cityName.textContent ="Unknown City";
    loading.classList.add("hidden");
}

document.querySelector("#weatherBtn").href = `weather.html?city=${city}`;
document.querySelector("#placesBtn").href = `places.html?city=${city}`;