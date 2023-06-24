class Cat {
    constructor(id, name, breed, picture) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.picture = picture;
    }

    toHTML() {
        return `
            <div id="${this.id}" class="card mb-3 ms-3">
                <img class="card-img-top" src="${this.picture}" />
                <div class="card-body">
                    <h5 class="card-title">${this.name}</h5>
                    <p class="card-text">${this.breed}</p>
                    <button class="btn btn-primary" onClick="updateCatSetup('${this.id}');">Update</button>
                    <button class="btn btn-danger" onClick="removeCat('${this.id}');">Remove</button>
                </div>
            </div>
        `;
    }
}

const catURL = "https://648f7d8c75a96b6644452e6d.mockapi.io/cat/";

function getCats() {
    $.get(catURL, (data) => {
        $("#cats").empty();

        for (cat of data) {
            let c = new Cat(cat.id, cat.name, cat.breed, cat.picture); // create a Cat using API data
            $("#cats").prepend(c.toHTML()); // adds cat card html to DOM
        }
    });
}

function createCat(cat) {
    $.ajax({ //return the ajax request
      url: catURL, //pass the url of the cat to be created
      data: JSON.stringify(cat), //pass the cat to be created and turns it into JSON data
      dataType: "json", //set the data type to be json
      type: "POST", //set the type of request to be a POST request
      contentType: "application/json", //set the content type to be json
      crossDomain: true,
      complete: () => { getCats(); }
    });
}

function removeCat(cID) {
    $.ajax({ //returns the ajax request
        url: `${catURL}/${parseInt(cID)}`, //pass the id of the cat to be deleted
        type: "DELETE", //set the type of request to be a delete request
        complete: () => { getCats(); }
      });
}

function updateCat(cat) {
    $.ajax({
        url: `${catURL}/${parseInt(cat.id)}`, //pass the id of the cat to be updated
        dataType: "json", //set the data type to be json
        data: JSON.stringify(cat), //passes the food group to be updated
        contentType: "application/json", //set the content type to be json
        crossDomain: true, //set the cross domain to be true
        type: "PUT", //set the type of request to be a put request
        complete: () => { getCats(); }
      });
}

function updateCatSetup(id) {
    $("#id").val(id); // sets hidden id field to current id
    $("#name").val($(`#${id} h5`).html()); // sets name field with current name
    $("#breed").val($(`#${id} p`).html()); // sets breed field with current breed
    $("#picture").val($(`#${id} img`).attr("src")); // sets picture field with current image path

    // toggle display of form buttons
    $("#createCat").hide();
    $("#updateCat").show();

    $("#cats button").prop("disabled", true); // disable all Update and Remove buttons on cat cards

    // auto scroll to the top of the page to access form
    let aTag = $("a#top");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

$("#updateCat").click((e) => {
    e.preventDefault(); // stop page refresh

    let c = new Cat($("#id").val(), $("#name").val(), $("#breed").val(), $("#picture").val()); // create current Cat from form data

    updateCat(c); // makes the ajax call

    // reset all form fields to blank
    $("#name").val("");
    $("#breed").val("");
    $("#picture").val("");

    // toggle display of form buttons
    $("#createCat").show();
    $("#updateCat").hide();

    $("#cats button").prop("disabled", false); // enable all Update and Remove buttons on cat cards
});

$("#createCat").click((e) => {
    e.preventDefault(); // stop page refresh

    let c = new Cat(null, $("#name").val(), $("#breed").val(), $("#picture").val()); // create a new Cat from form data

    createCat(c); // makes ajax call

    // reset all form fields to blank
    $("#name").val("");
    $("#breed").val("");
    $("#picture").val("");
});
  

getCats();