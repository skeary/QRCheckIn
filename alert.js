 


function alertWrapper(message) {
	if (navigator && navigator.notification) {
		navigator.notification.alert("message", "Error", "OK"); 
	}
	else {
		alert(message);
	}
}