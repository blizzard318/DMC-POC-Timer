const Regions = {
	"NA":0,
	"SA":1,
	"EU":2,
	"ASIA":3
};
const MornReset  = ["12.0", "11.0",  "7.0", "4.3"];
const NoonReset  = ["16.0", "15.0", "11.0", "4.3"];
const ANoonReset = ["18.0", "17.0", "13.0", "6.3"];
var Region;
let RunOnce = true;

// Update the count down every 1 second
setInterval(function() {
	// Get today's date and time
	let sgtime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore'});
	let now = new Date(sgtime);
	
	let timings = {
		"Mon7"  : GetTime(MornReset, 0),
		"Tue7"  : GetTime(MornReset, 1),
		"Wed7"  : GetTime(MornReset, 2),
		"Thu7"  : GetTime(MornReset, 3),
		"Fri7"  : GetTime(MornReset, 4),
		"Sat7"  : GetTime(MornReset, 5),
		"Sun7"  : GetTime(MornReset, 6),
		
		"Mon11" : GetTime(NoonReset, 0),
		"Tue11" : GetTime(NoonReset, 1),
		"Wed11" : GetTime(NoonReset, 2),
		"Thu11" : GetTime(NoonReset, 3),
		"Fri11" : GetTime(NoonReset, 4),
		"Sat11" : GetTime(NoonReset, 5),
		"Sun11" : GetTime(NoonReset, 6),
		
		"Mon13" : GetTime(ANoonReset, 0)
	};
	
	for (const [key, value] of Object.entries(timings)) {
		document.getElementById(key).innerHTML = GetString(value);
	}
	
	if (RunOnce) {
		RunOnce = false;
		SortDiv();
	}
	
	function SortDiv (){
		let nlist = document.getElementById('nlist');
		let olist = document.getElementById('olist');
		olist.innerHTML = nlist.innerHTML;
		
		let items = Object.keys(timings).map((key) => [key, timings[key]]);
		items.sort((first, second) => second[1] - first[1]);

		console.log(items);
		for(let i = 0; i < items.length; i++) {
			//nlist.appendChild(document.getElementById[items[i][0]].parentNode);
		}
		olist.innerHTML = "";
	}
	
	function GetTime(TimeArray, Day){
		let Hour = TimeArray[Regions[Region]].split('.')[0];
		let Min  = TimeArray[Regions[Region]].split('.')[1];
		
		let Greater = new Date();
		Greater.setHours(Hour);
		Greater.setMinutes(Min);
		Greater.setSeconds(0);
		
		if (now.getHours() == Hour) {
			if (now.getMinutes() > Min) 
				Greater.setDate(Greater.getDate() + (7 - (Greater.getDay() - Day)));
			else if (now.getMinutes() == Min && now.getSeconds() == 0){
				new Notification("Something Reset!");
				navigator.vibrate(200);
			}
		}else if (now.getHours() > Hour) 
			Greater.setDate(Greater.getDate() + (8 - (Greater.getDay() - Day)));
		
		return Greater - now;
	}
	
	function GetString(Countdown){
		let days = Math.floor(Countdown / (1000 * 60 * 60 * 24));
		days %= 7;
		let hours = Math.floor((Countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((Countdown % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((Countdown % (1000 * 60)) / 1000);
		
		if (days == 0)
			return hours + "h " + minutes + "m " + seconds + "s ";
		else 
			return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
	}
}, 1000);

async function ShowPart2(region) {
	localStorage.setItem("region",region);
	document.getElementById("Part2").style.display = "block";
	Region = document.getElementById("region").innerText = region;
	
	const urlParams = new URLSearchParams(window.location.search);
	urlParams.set('region', region);
	window.location.search = urlParams;
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