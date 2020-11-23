var restaurant = JSON.parse(localStorage.getItem('detailRestaurant'))
db = firebase.firestore();
function goToAddFeedback() {
    window.location.href = "AddFeedback.html";
}
function init() {
    renderDetailRestaurant();
    renderFeedback();
}
init()

function renderDetailRestaurant() {
    let content = ''
    content += `
    <p class="text-center h3 mt-5 pt-3 mb-0">`+ restaurant.restaurant_Name + `</p>
    <p class="text-center">( `+ restaurant.restaurant_type + ` )</p>
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
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
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
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
    </div>`
    document.getElementById("content").innerHTML = content
}

function renderFeedback() {
    let feedback = []
    db.collection("feedback")
        .where("restaurant_Name", "==", restaurant.restaurant_Name).get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                feedback.push(doc.data())
            })
            let feedbackInner = ''
            feedback.forEach(element => {
                feedbackInner += `<div class="card my-3" style="width: 100%">
            <div class="card-body">
                <div class="card-title h4"><i class="fa fa-user-circle" aria-hidden="true"></i>`+ element.assessor.name + `</div>
                <h6 class="card-subtitle mb-2 text-muted">`+ element.created_date + `</h6>
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
        </div>
        
        `
            });
            document.getElementById("feedback").innerHTML = feedbackInner
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
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