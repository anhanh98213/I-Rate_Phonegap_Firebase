
function receive_data(){
    let email = localStorage.getItem('email')
    if (email != null) {
        console.log(email)
        document.getElementById("email_field").value = email;
    }else{
        console.log('not have data')
    }
}
receive_data()

function login() {
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
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((res) => { res ? window.location.href = "Home.html" : null;
                localStorage.removeItem('email') })
        .catch(function (error) {
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
function goToSignUp(){
    window.location.href = "SignUpScreen.html";
}
