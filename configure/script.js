const appId = "nuttys-ytmdesktop-widget";
const appName = "nuttys YouTube Music Widget";
const appVersion = "1.0.0";
const baseURL = "http://LostXC.github.io/MusicPlayerWidgetEseninocafe";

let browserSourceURL = "";

async function RequestCode() {
	const response = await fetch("http://localhost:9863/api/v1/auth/requestcode", {
		method: "POST",
		body: JSON.stringify({
			"appId": appId,
			"appName": appName,
			"appVersion": appVersion
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	});
	
	const responseData = await response.json();
	if (responseData.hasOwnProperty("statusCode")) {
		document.getElementById("errorCode").innerText = responseData.statusCode;
		document.getElementById("errorMessage").innerText = responseData.message;
		document.getElementById("errorBox").style.display = 'inline';
	} else {
		return responseData;
	}
}

async function RequestToken() {
	const requestCode = await RequestCode();
	if (!requestCode) return;
	
	const authCode = requestCode.code;
	document.getElementById("authorizationCode").innerText = authCode;
	document.getElementById("authorizationBox").style.display = 'inline';

	const response = await fetch("http://localhost:9863/api/v1/auth/request", {
		method: "POST",
		body: JSON.stringify({
			"appId": appId,
			"code": authCode
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	});

	const responseData = await response.json();
	if (responseData.hasOwnProperty("statusCode")) {
		document.getElementById("errorCode").innerText = responseData.statusCode;
		document.getElementById("errorMessage").innerText = responseData.message;
		document.getElementById("errorBox").style.display = 'inline';
		document.getElementById("authorizationBox").style.display = 'none';
	} else {
		const token = responseData.token;
		browserSourceURL = `${baseURL}?token=${token}`;
		
		document.getElementById("copyURLButton").disabled = false;
		document.getElementById("copyURLButton").innerText = "Click to copy URL";
		document.getElementById("authorizationCode").style.display = 'none';
		document.getElementById("donateButton").style.display = 'block';
		document.getElementById("authorizationComplete").style.display = 'block';
	}
}

function CopyToURL() {
	navigator.clipboard.writeText(browserSourceURL);
	
	document.getElementById("copyURLButton").innerText = "Copied to clipboard";
	document.getElementById("copyURLButton").style.backgroundColor = "#00dd63";
	document.getElementById("copyURLButton").style.color = "#ffffff";

	setTimeout(() => {
		document.getElementById("copyURLButton").innerText = "Click to copy URL";
		document.getElementById("copyURLButton").style.backgroundColor = "#ffffff";
		document.getElementById("copyURLButton").style.color = "#181818";
	}, 3000);
}

function OpenInstructions() {
    window.open("https://www.notion.so/nuttylmao/YouTube-Music-Widget-18d19969b23780e2bb56d25eed4d154e", '_blank').focus();
}

function OpenDonationPage() {
    window.open("http://nutty.gg/pages/donate", '_blank').focus();
}

function CloseErrorBox() {
	document.getElementById("errorBox").style.display = 'none';
}