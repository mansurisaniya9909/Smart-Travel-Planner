const params = new URLSearchParams(window.location.search);
const city = params.get("city");

const cityName = document.querySelector("#cityName");
const loading = document.querySelector("#loading");
const placesBox = document.querySelector("#placeBox");
const errors = document.querySelector("#error");

let openweathermap_apikey = "bd1a9c62c57a999fdf90e514baaac1ee"; //lat and lon
let unsplash_apikey = "fj7yByXWOCUUaju5_E3c6TZTZLnW4c-xukLFvXZ245o"; //images
let geoapify_apikey = "d189db9fb8d647208f8d0121c62a269d"; //places name

if (!city) {
  loading.classList.add("hidden");
  errors.textContent = "City Not Provided";
  errors.classList.remove("hidden");
} else {
  cityName.textContent = `Best places in ${city}`;

  async function fetchPlaces(cityName) {
    try {
      //get lat and lon from openweathermap api
      const geoRes = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${openweathermap_apikey}`,
      );

      const geoData = await geoRes.json();

      if (!geoData.length) throw new Error("City Not Found");

      const { lat, lon } = geoData[0];

      // Get places from geoapify

      const placesRes = await fetch(
        `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${lon},${lat},12000&limit=12&apiKey=${geoapify_apikey}`,
      );

      if (!placesRes.ok) throw new Error("Places API failed");

      const data = await placesRes.json();
      // console.log(data);

      loading.classList.add("hidden");

      if (!data.features.length) throw new Error("No Places Found");

      placesBox.classList.remove("hidden");
      placesBox.innerHTML = "";

      for (let place of data.features) {
        let imageUrl = `https://placehold.co/400x300?text=Tourist+Spot`;

        try {
          const query = place.properties.name
            ? place.properties.name + " " + city + "tourism"
            : city + "tourism";

          const unsplashRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${unsplash_apikey}`,
          );

          const unsplashData = await unsplashRes.json();
          console.log(unsplashData);

          if (unsplashData.results && unsplashData.results.length > 0) {
            imageUrl = unsplashData.results[0].urls.small;
          }
        } catch (error) {
          console.log(error, "Unsplash image not found");
        }

        // console.log(data);

        let div = document.createElement("div");

        div.className =
          "bg-white rounded-xl shadow hover:shadow-lg transition hover:scale-125 overflow-hidden";

        div.innerHTML = `<img src="${imageUrl}" alt="${place.properties.name}" class="w-full h-40 object-cover"/>

      <div class="p-4">
        <h3 class="font-bold text-lg text-green-700 mb-1">${place.properties.name || "Tourist Place"}</h3>
        <P class="text-sm text-gray-600">${place.properties.city || city}</p>
      </div>`;
        placesBox.appendChild(div);
      }
      console.log(data);
    } catch (error) {
      console.log("Places Error:", error.message);
      loading.classList.add("hidden");
      errors.textContent = error.message;
      errors.classList.remove("hidden");
    }
  }
  fetchPlaces(city);
}

//geoapify:- 1d2323bb0c06430c871a6abc972f9ca2
// unsplashapi:- par9z_UmyBNg4awQGCVWijIRi18THrMOuDaYzkouIUU
// weather api:- 6394e37da81b77b2ed8ba52ba425e1ee
