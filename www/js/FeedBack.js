db = firebase.firestore();
let user = firebase.auth().currentUser;
var data = []
init()
function init() {
    setTimeout(function () {
        let user = firebase.auth().currentUser;
        search(user.email)
    }, 700)
}
function search(email) {
    let arrId = []
    let arr = []
    let arrName = []
    var feedback = db.collection("feedback");
    var query = feedback
        .orderBy("assessor.email")
        .startAt(email)
        .endAt(email)
    query.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            arrId.push(doc.id)
            arr.push(doc.data())
            arrName.push(doc.data().restaurant_Name)
        });

        cupRestaurant(arrId, arr, [...new Set(arrName)])
    }).catch(function (error) {
        console.log("Error getting documents: ", error);
    });
}


function cupRestaurant(arrId, arr, arrName) {
    let arrEnd = []
    let restaurant = {}
    let feedback = {}
    arrName.forEach((itemname) => {
        var indices = [];
        db.collection("restaurant")
            .where("restaurant_Name", "==", itemname).get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    restaurant = doc.data()
                    arr.forEach(function (item, index) {
                        if (itemname == item.restaurant_Name) {
                            feedback = item
                            feedback.id = arrId[index]
                            indices.push(item)
                        }
                    });
                    restaurant.feedback = indices
                    arrEnd.push(restaurant)
                });
                renderDetailRestaurant(arrEnd)
                renderFeedback(arrEnd)
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    })
}


function renderDetailRestaurant(data) {
    let content = ''
    data.forEach(restaurant => {
        content += `
        <div class="card my-3 p-1" style="width: 100%">
    <p class="text-center h3 mb-0">`+ restaurant.restaurant_Name + `</p>
    <p class="text-center">( `+ restaurant.restaurant_type + ` )</p>
    <div id="`+ restaurant.restaurant_Name + `" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
            <li data-target="#`+ restaurant.restaurant_Name + `" data-slide-to="0" class="active"></li>
            <li data-target="#`+ restaurant.restaurant_Name + `" data-slide-to="1"></li>
            <li data-target="#`+ restaurant.restaurant_Name + `" data-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="`+ restaurant.images[0] + `" class="d-block w-100" alt="..." height = 250px>
            </div>
            <div class="carousel-item">
                <img src="`+ restaurant.images[1] + `" class="d-block w-100" alt="..." height = 250px>
            </div>
            <div class="carousel-item">
                <img src="`+ restaurant.images[2] + `" class="d-block w-100" alt="..." height = 250px>
            </div>
        </div>
        <a class="carousel-control-prev" href="#`+ restaurant.restaurant_Name + `" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#`+ restaurant.restaurant_Name + `" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
        <table class="table table-borderless">
            <tbody>
                <tr>
                    <th scope="row">Food Quality Rating</th>
                    <td>`+ renderStar(restaurant.Foo_Quality_Rating) + `</td>
                </tr>
                <tr>
                    <th scope="row">Cleanliness Rating</th>
                    <td>`+ renderStar(restaurant.cleanliness_Rating) + `</td>
                </tr>
                <tr>
                    <th scope="row">Service Rating</th>
                    <td>`+ renderStar(restaurant.service_Rating) + `</td>
                </tr>
            </tbody>
        </table>
    </div>
        <div style="width: 100%; height: 2px;" class="shadow-lg bg-secondary"></div>
        <div id="feedback`+ restaurant.restaurant_Name + `"></div>
    </div>`
    });
    document.getElementById("content").innerHTML = content
}
function renderFeedback(data) {
    let feedbackId = []
    data.forEach(restaurant => {
        let feedback = restaurant.feedback
        let feedbackInner = ''
        feedback.forEach(element => {
            feedbackId.push(element.id)
            feedbackInner += `<div class="card my-3" style="width: 100%">
            <div class="card-body">
                <div class="row mb-2">
                    <div class="col-2 p-0 text-center align-self-center">
                        <i class="fa fa-user-circle"  style="font-size:30px" ></i>
                    </div>
                    <div class="col-8 p-0 align-self-center">
                        <p class="h4 m-0">`+ element.assessor.name + `</p></div>
                        <i class="fa fa-edit col-2 align-self-center p-0" style="font-size:25px" id="`+ element.id + `" ></i>
                </div>
                <p class="mb-2 text-muted">`+ element.created_date + `</p>
                <p class="card-text">`+ element.note + `</p>
                <div class="row">
                    <p class="col-6">Food Quality Rating</p>
                    <div class="col-6">
                        <p>`+ renderStar(element.Foo_Quality_Rating) + `</p>
                    </div>
                </div>
                <div class="row">
                    <p class="col-6">Cleanliness Rating</p>
                    <div class="col-6">
                        <p>`+ renderStar(element.cleanliness_Rating) + `</p>
                    </div>
                </div>
                <div class="row">
                    <p class="col-6">Service Rating</p>
                    <div class="col-6">
                        <p>`+ renderStar(element.service_Rating) + `</p>
                    </div>
                </div>
            </div>
        </div>`
        })
        document.getElementById(`feedback` + restaurant.restaurant_Name + ``).innerHTML = feedbackInner
    });
    feedbackId.forEach(element => {
        document.getElementById(element).addEventListener('click', function () {
            goEditFeedback(element)
        });
    });

}


function renderStar(rating) {
    let render = ''
    rating = rating.toString();
    let natural
    let decimal
    if (rating.length > 2) {
        natural = parseInt(rating.slice(0, rating.indexOf("freetuts.net") - 1))
        decimal = parseInt(rating.slice(rating.indexOf("freetuts.net")))
    } else {
        natural = rating
        decimal = 0
    }
    for (var i = 1; i <= 5; i++) {
        if (natural >= i) {
            render += `<i class="fa fa-star" style="font-size:20px;color:#0099FF"></i>`
        } else if (natural + 1 == i && decimal > 0) {
            render += `<i class="fa fa-star-half-empty" style="font-size:20px;color:#0099FF"></i>`

        } else if (natural < i) {
            render += `<i class="fa fa-star-o" style="font-size:20px;color:#0099FF"></i>`
        }
    }
    return render
}

function goEditFeedback(id) {
    localStorage.setItem('idFeedback', id)
    window.location.href = "EditFeedback.html";
    console.log(id)
}