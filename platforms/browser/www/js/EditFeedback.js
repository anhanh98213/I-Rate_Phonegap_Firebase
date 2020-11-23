var db = firebase.firestore();
var idFeedback
var feedBack = {}
var service_Rating, cleanliness_Rating, food_Quality_Rating

init()
function init() {
    idFeedback = localStorage.getItem('idFeedback')
    getFeedback(idFeedback)
}
function getFeedback(idFeedback) {
    db.collection('feedback')
        .doc(idFeedback)
        .get()
        .then(function (doc) {
            console.log(doc.id, " => ", doc.data())
            feedBack = doc.data()
            service_Rating = feedBack.service_Rating
            cleanliness_Rating = feedBack.cleanliness_Rating
            food_Quality_Rating = feedBack.Foo_Quality_Rating
            renderDefaultFeedBack(feedBack, service_Rating, cleanliness_Rating, food_Quality_Rating)
        }).catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}
function renderDefaultFeedBack(feedBack, service_Rating, cleanliness_Rating, food_Quality_Rating) {
    let content = ''
    content += ` 
    <p class="h5 text-center"> Edit feedback</p> <p class="h5 text-center">for restaurant ` + feedBack.restaurant_Name + `</p>
    <div class="form-group">
        <label>Reporter:</label>
        <input id="Reporter" type="text" class="form-control text-dark border py-4" value="` + feedBack.assessor.name + `" required>
    </div>
    <div class="form-group">
        <label>Restaurant Name:</label>
        <input id="restaurant_Name" type="text" value="` + feedBack.restaurant_Name + `" class="form-control text-dark border py-4" disabled>
    </div>
    <div class="form-group">
       <label>Restaurant type:</label>
        <input id="restaurant_type" type="text" value="` + feedBack.restaurant_type + `" class="form-control text-dark border py-4" disabled>
    </div>
    <div  class="form-group">
        <label>Date and time of the visit:</label>
        <input id="time_visit" type="date" value="` + feedBack.time_visit + `" class="form-control text-dark border py-4" required>
    </div>
    <div class="form-group">
        <label>Average meal price per person:</label>
        <input id="price" type="number" value="` + feedBack.price + `" class="form-control text-dark border py-4" required>
    </div>
    <div  class="form-group">
        <label>Notes:</label>
        <textarea id="note" class="form-control text-dark border py-4" rows="3">` + feedBack.note + `</textarea>
    </div>
    <div id="renderStar">
        <table class="table table-borderless">
            <tbody>
                <tr>
                    <th scope="row">Food Quality Rating</th>
                    <td>`+ renderFoodQualityStar(food_Quality_Rating) + `</td>
                </tr>
                <tr>
                    <th scope="row">Cleanliness Rating</th>
                    <td>`+ renderCleanlinessStar(cleanliness_Rating) + `</td>
                </tr>
                <tr>
                    <th scope="row">Service Rating</th>
                    <td>`+ renderServiceStar(service_Rating) + `</td>
                </tr>
            </tbody>
        </table>
    </div>
    `
    document.getElementById("content").innerHTML = content
}
function renderStar(rating, service) {
    let star = ''
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            star += `<i onclick="set` + service + `(` + i + `)" class="fa fa-star" style="font-size:20px;color:#0099FF"></i>`
        } else {
            star += `<i onclick="set` + service + `(` + i + `)" class="fa fa-star-o" style="font-size:20px;color:#0099FF"></i>`
        }
    }
    return star
}
function renderServiceStar(rating) {
    return renderStar(rating, "ServiceRating")
}
function renderCleanlinessStar(rating) {
    return renderStar(rating, "CleanlinessRating")
}
function renderFoodQualityStar(rating) {
    return renderStar(rating, "FoodQualityRating")
}
function setServiceRating(i) {
    service_Rating = i
    renderRating()
}
function setCleanlinessRating(i) {
    cleanliness_Rating = i
    renderRating()
}
function setFoodQualityRating(i) {
    food_Quality_Rating = i
    renderRating()
}
function renderRating() {
    document.getElementById("renderStar").innerHTML = `
    <table class="table table-borderless">
        <tbody>
            <tr>
                <th scope="row">Food Quality Rating</th>
                <td>`+ renderFoodQualityStar(food_Quality_Rating) + `</td>
            </tr>
            <tr>
                <th scope="row">Cleanliness Rating</th>
                <td>`+ renderCleanlinessStar(cleanliness_Rating) + `</td>
            </tr>
            <tr>
                <th scope="row">Service Rating</th>
                <td>`+ renderServiceStar(service_Rating) + `</td>
            </tr>
        </tbody>
    </table>
                `
}
function pushData() {
    let user = firebase.auth().currentUser;
    let reporter = document.getElementById("Reporter").value
    let name = document.getElementById("restaurant_Name").value
    let type = document.getElementById("restaurant_type").value
    let time_visit = document.getElementById("time_visit").value
    let price = document.getElementById("price").value
    let notes = document.getElementById("note").value
    if (validateInput(reporter, time_visit, price)) {
        feedBack = {
            "assessor": {
                "name": reporter,
                "email": user.email
            },
            "restaurant_Name": name,
            "restaurant_type": type,
            "Foo_Quality_Rating": food_Quality_Rating,
            "cleanliness_Rating": cleanliness_Rating,
            "service_Rating": service_Rating,
            "time_visit": time_visit,
            "note": notes,
            "price": price,
            "created_date": new Date().toDateString()
        }
        document.getElementById("Edit_Feedback").setAttribute("data-toggle", "modal");
        document.getElementById("Edit_Feedback").setAttribute("data-target", "#exampleModal");
        document.getElementById("addConfirm").innerHTML = `
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-center" id="exampleModalLabel">Response by `+ reporter + `</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <table class="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th scope="row">Restaurant Name</th>
                                        <td>`+ name + `</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Restaurant type</th>
                                        <td>`+ type + `</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Date and time of the visit</th>
                                        <td>`+ time_visit + `</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Average meal price per person</th>
                                        <td>`+ price + `</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Food quality rating</th>
                                        <td>`+ food_Quality_Rating + ` <i class="fa fa-star" style="font-size:20px;color:#0099FF"></i></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Cleanliness rating</th>
                                        <td>`+ cleanliness_Rating + ` <i class="fa fa-star" style="font-size:20px;color:#0099FF"></i></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Service rating</th>
                                        <td>`+ service_Rating + ` <i class="fa fa-star" style="font-size:20px;color:#0099FF"></i></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Notes</th>
                                        <td>`+ notes + `</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button onclick="editData()" type="button" class="btn btn-primary">Edit Feedback</button>
                        </div>
                    </div>
                </div>
            </div>`
    }
}

function editData() {
    db.collection('feedback').doc(idFeedback).set(feedBack)
        .then(function () {
            db.collection("restaurant")
                .where("restaurant_Name", "==", feedBack.restaurant_Name).get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        db.collection("restaurant")
                            .doc(doc.data().restaurant_Name)
                            .update({
                                "Foo_Quality_Rating": (doc.data().Foo_Quality_Rating + feedBack.Foo_Quality_Rating) / 2,
                                "cleanliness_Rating": (doc.data().cleanliness_Rating + feedBack.cleanliness_Rating) / 2,
                                "service_Rating": (doc.data().service_Rating + feedBack.service_Rating) / 2,
                            })
                            .then(function () {
                                alert('Your response has been sent')
                                window.location.href = "Feedback.html"
                            });
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}

function validateInput(reporter, time_visit, price) {
    let arr = []
    let errorMessage = ''
    if (!reporter) arr.push('Name of the reporter')
    if (!time_visit) arr.push('Date and time of the visit')
    if (!price) arr.push('Average meal price per person')
    if (!reporter || !time_visit || !price) {
        arr.forEach(element => {
            errorMessage += (element + ' \n \ ')
        });
        alert('You must input all field: \n \ ' + errorMessage)
        return false
    } else return true
}