function checkInfo() {
    var user = firebase.auth().currentUser;
    setTimeout(function () {user ? window.location.href = "home.html" : window.location.href = "login.html"}, 3000)
}
checkInfo()

