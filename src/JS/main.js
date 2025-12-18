let searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () =>{
    let city = document.getElementById("cityInput").value.trim();

    if(city === ""){
        alert("Please Enter a City or Country");
        return;
    }
    window.location.href=`destination.html?city=${city}`;
});