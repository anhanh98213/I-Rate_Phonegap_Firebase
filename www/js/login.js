function receive_data() {
    let email = localStorage.getItem('email')
    if (email != null) {
        console.log(email)
        document.getElementById("email_field").value = email;
    } else {
        console.log('Not have data')
    }
}
receive_data()

function login() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("password_field").value;
    if (email.length < 4) {
        alert('Please enter email!');
        return;
    }
    if (password.length < 4) {
        alert('Please enter password!');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((res) => {
        if (res) {
            goToHome();
        } else {
            null;
        }
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
}

function goToHome() {
    window.location.href = "home.html";
}

function goToSignUp() {
    window.location.href = "signup.html";
}