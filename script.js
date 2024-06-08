const Regions = {
	"NA":0,
	"SA":1,
	"EU":2,
	"ASIA":3
};
const MornReset  = ["12.0",  "11.0",  "7.0", "4.3"];
const NoonReset  = ["16.0", "15.0", "11.0", "4.3"];
const ANoonReset = ["18.0", "17.0", "13.0", "6.3"];
var Region;

// Update the count down every 1 second
setInterval(function() {
	// Get today's date and time
	let sgtime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore'});
	let now = new Date(sgtime);
	
	document.getElementById("Daily7" ).innerHTML = GetTime(MornReset );
	document.getElementById("Daily11").innerHTML = GetTime(NoonReset );
	
	document.getElementById("Mon7" ).innerHTML = GetTime(MornReset, 0);
	document.getElementById("Mon11").innerHTML = GetTime(NoonReset, 0);
	document.getElementById("Mon1" ).innerHTML = GetTime(ANoonReset,0);
	
	document.getElementById("Thu11").innerHTML = GetTime(NoonReset, 3);
	document.getElementById("Sat7").innerHTML  = GetTime(MornReset, 5);
	document.getElementById("Sun7").innerHTML  = GetTime(MornReset, 6);
	
	function GetTime(TimeArray, Day = -1){
		let Hour = TimeArray[Regions[Region]].split('.')[0];
		let Min  = TimeArray[Regions[Region]].split('.')[1];
		
		let Greater = new Date();
		Greater.setHours(Hour);
		Greater.setMinutes(Min);
		Greater.setSeconds(0);
		
		if (now.getHours() == Hour) {
			if (now.getMinutes() > Min) 
				Greater.setDate(Greater.getDate() + (8 - (Greater.getDay() - Day)));
			else if (now.getMinutes() == Min && now.getSeconds() == 0){
				new Notification("Something Reset!");
				navigator.vibrate(200);
			}
		}else if (now.getHours() > Hour) 
			Greater.setDate(Greater.getDate() + (8 - (Greater.getDay() - Day)));
		
		
		let dailyReset = Greater - now;
		let days = Math.floor(dailyReset / (1000 * 60 * 60 * 24));
		days %= 7;
		let hours = Math.floor((dailyReset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((dailyReset % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((dailyReset % (1000 * 60)) / 1000);
		
		if (Day == -1 || days == 0)
			return hours + "h " + minutes + "m " + seconds + "s ";
		else 
			return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
	}
}, 1000);
	
async function ShowPart2(region) {
	localStorage.setItem("region",region);
	document.getElementById("Part2").style.display = "block";
	Region = document.getElementById("region").innerText = region;
}

function init() {
    if (!sessionStorage.getItem('darkmode') && window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches)
        sessionStorage.setItem('darkmode', true);

    SetDarkMode(sessionStorage.getItem('darkmode') === 'true');
    document.getElementById('darkmode').checked = (sessionStorage.getItem('darkmode') === 'true');
    document.getElementById('darkmode').addEventListener('change', () => SetDarkMode(document.getElementById('darkmode').checked));

    function SetDarkMode(setval) {
        if (setval) document.querySelector('html').dataset.darkmode = true;
        else delete document.querySelector('html').dataset.darkmode;

        sessionStorage.setItem('darkmode', setval);
    }
	
    document.getElementById('notification').addEventListener('change', () => {
		if (document.getElementById('notification').checked && Notification.permission !== "granted")
			Notification.requestPermission();
	});

	const params = new Proxy(new URLSearchParams(window.location.search), {
	  get: (searchParams, prop) => searchParams.get(prop),
	});
	
	if (params.region != null) 
		ShowPart2(params.region);
	else if (sessionStorage.getItem('region') === 'true')
		ShowPart2(sessionStorage.getItem('region'));
}