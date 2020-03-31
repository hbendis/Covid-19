// The following line makes sure your styles are included in the project. Don't remove this.
import '../styles/main.scss';
// Import any additional modules you want to include below \/


// \/ All of your javascript should go here \/



document.addEventListener('DOMContentLoaded', function(){

	GLOBALdata = [];
	GLOBALselectCreated = false;
	GLOBALfirstChoice = getUrlParam();
	nCovValues.init();

});

const getUrlParam = function () {

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const urlParamExists = urlParams.get('country')

	if ( urlParamExists ) {
		
		const customCountry = urlParamExists.charAt(0).toUpperCase() + urlParamExists.slice(1).toLowerCase();
		return customCountry;

	} else {
	
		return "Total";
	
	}

};

const nCovValues = ( function () {

	const modifyCors = function () {

		( function () {

			const cors_api_host = 'cors-anywhere.herokuapp.com';
			const cors_api_url = 'https://' + cors_api_host + '/';
			const slice = [].slice;
			const origin = window.location.protocol + '//' + window.location.host;
			const open = XMLHttpRequest.prototype.open;

			XMLHttpRequest.prototype.open = function () {

				const args = slice.call(arguments);
				const targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);

				if ( targetOrigin && targetOrigin[0].toLowerCase() !== origin && targetOrigin[1] !== cors_api_host ) {

					args[1] = cors_api_url + args[1];

				}

				return open.apply(this, args);

			};

		}) ();

	};

	const getHtmlSource = function () {

		modifyCors();
		
		const SelectedCountry = GLOBALfirstChoice;
		const container = document.getElementById("contain-temp");
		const progressLogo = document.getElementById("contain-progress");

		let xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://www.worldometers.info/coronavirus/#countries');
		xhr.addEventListener('readystatechange', function() {

			if ( xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 ) {

				container.innerHTML =  xhr.responseText;
				GLOBALdata = document.getElementsByTagName('table')[0].innerText.replace(":","").split('\n');
				container.innerHTML = "";
				progressLogo.innerHTML = "";
				createSelectOptions();
				extractValues(GLOBALfirstChoice);

			}

		});

		xhr.send(null); 

	};

	const createSelectOptions = function () {

		let optionList = [];
		let countryCount = 0;

		for ( let i = 11; i < GLOBALdata.length; i++ ) {
		
			optionList.push(GLOBALdata[i].split(/\t/g)[0]);
			countryCount++;
			
		}
		
		// - diamond princess - Total
		countryCount = countryCount - 2;

		let selectList = document.createElement("select");
		let firstOption = document.createElement("option");
		firstOption.selected = true;
		firstOption.value = 'noChoice';
		firstOption.text = 'Select Country';
		selectList.class = "select";
		selectList.appendChild(firstOption);

		selectList.addEventListener('change', function(){ nCovValues.changeCountry(this.value); });

		document.getElementById("contain-select").appendChild(selectList);

		for ( let IdCountry in optionList.sort() ){

			let newOption = document.createElement("option");
			newOption.value = optionList[IdCountry];
			newOption.text = optionList[IdCountry];
			selectList.appendChild(newOption);

			const ThisFirstChoice = GLOBALfirstChoice.charAt(0).toUpperCase() + GLOBALfirstChoice.slice(1).toLowerCase();
			
			if ( optionList[IdCountry] == ThisFirstChoice ) {

				let ThisIndex = Number(IdCountry) + 1;
				selectList.selectedIndex = ThisIndex;

			}

		}

		document.getElementById("contain-NbCoutry").innerText = countryCount + " Countries Affected";
		document.getElementById("contain-title").innerText = "COVID-19 BREAKING NEWS";

		selectList.remove(0);
		if ( ! GLOBALselectCreated ) extractValues(GLOBALfirstChoice);
		GLOBALselectCreated = true;

	};

	const extractValues = function (SelectedCountry) {

		let covidValues = [];

		for ( let i = 0; i < GLOBALdata.length; i++ ) {

			if ( GLOBALdata[i].indexOf(SelectedCountry) != -1 ) var rawValues = GLOBALdata[i].split(/\t/g);

		}

		for ( let i = 0; i < 8; i++ ) covidValues[i] = rawValues[i]

		displayValues(covidValues);

	};

	const displayValues = function (countersValues) {

		const covCountry = countersValues[0];
		const covTotalCases = countersValues[1];
		const covNewCases = countersValues[2];
		const covTotalDeaths = countersValues[3];
		const covNewDeaths = countersValues[4];
		const covTotalRecovered = countersValues[5];
		const covActiveCases = countersValues[6];
		const covCritical = countersValues[7];

		const thisTable = document.getElementById('contain-table');
		let thisContent = '<table class="table">';
		thisContent += '<tr><th id="sur-th"></th><th>Total Cases</th><th>New Cases</th><th>Total Deaths</th><th>New Deaths</th><th>Active Cases</th><th>Total Recovered</th><th>Critical Cases</th></tr>';
		thisContent += '<tr><td id="sur-td">'+covCountry+'</td><td>'+covTotalCases+'</td><td class="yellow">'+covNewCases+'</td><td>'+covTotalDeaths+'</td><td class="red">'+covNewDeaths+'</td><td>'+covActiveCases+'</td><td>'+covTotalRecovered+'</td><td>'+covCritical+'</td></tr>';
		thisContent += '</table>';
		thisTable.innerHTML = thisContent;

	};

	return { 

		init : getHtmlSource,
		changeCountry : extractValues

	};

})();