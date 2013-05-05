 


function alertWrapper(message) {
	if (navigator && navigator.notification) {
		navigator.notification.alert(message, null, "Error"); 
	}
	else {
		alert(message);
	}
}