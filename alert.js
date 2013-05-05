 


function alertWrapper(message) {
	if (navigator && navigator.notification) {
		navigator.notification.alert(message, "OK", "Error"); 
	}
	else {
		alert(message);
	}
}