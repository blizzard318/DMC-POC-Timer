const Regions = {
	"NA":0,
	"SA":1,
	"EU":2,
	"ASIA":3
};
const MornReset  = ["12.0",  "7.0",  "7.0", "4.3"];
const NoonReset  = ["16.0", "11.0", "11.0", "4.3"];
const ANoonReset = ["18.0", "13.0", "13.0", "6.3"];
var Region = "EU";

// Update the count down every 1 second
setInterval(function() {
	// Get today's date and time
	let sgtime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore'});
	let now = new Date(sgtime);
	
	SetTime("MornReset" , MornReset );
	SetTime("NoonReset" , NoonReset );
	SetTime("ANoonReset", ANoonReset);
	
	function SetTime(TimeId, TimeArray){
		let Hour = TimeArray[Regions[Region]].split('.')[0];
		let Min = TimeArray[Regions[Region]].split('.')[1];
		
		let Greater = new Date();
		Greater.setHours(Hour);
		Greater.setMinutes(Min);
		Greater.setSeconds(0);
		
		if (now.getHours() == Hour) {
			if (now.getMinutes() > Min)
				Greater.setDate(Greater.getDate() + 1);
		}else if (now.getHours() > Hour)
			Greater.setDate(Greater.getDate() + 1);
		
		let dailyReset = Greater - now;
		let hours = Math.floor((dailyReset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((dailyReset % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((dailyReset % (1000 * 60)) / 1000);
		
		document.getElementById(TimeId).innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
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

	if (sessionStorage.getItem('region') === 'true')
		ShowPart2(sessionStorage.getItem('region'));
}