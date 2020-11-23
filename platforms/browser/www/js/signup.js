function signUp() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("password_field").value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((res) => { regis() })
        .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        errorCode == 'auth/email-already-in-use' ? alert('The email already exists.') : alert(errorMessage);
        errorCode == 'auth/weak-password' ? alert('The password is too weak.') : alert(errorMessage);
        console.log(error);
    });
}   

function regis() {
    var user = firebase.auth().currentUser;
    if (user) {
        alert("Register successful");
        localStorage.setItem('email', user.email)
        firebase.auth().signOut();
        window.location.href = "home.html";
    }
}
function goLogin(){
    window.location.href = "login.html";
}