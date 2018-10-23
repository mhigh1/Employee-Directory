// Add toProperCase property to string objects
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

// Contact Card Template
const tmplContactCard = function(contactName, contactTel, contactOfc, contactPhoto) {
    return `
    <div class="col-sm-4">
        <div class="card p-3 mb-3">
            <img class="card-img-top rounded-circle m-auto w-75" src="./assets/images/photos/${contactPhoto}" alt="Employee Photo">
            <div class="card-body">
                <h5 class="card-title">${contactName}</h5>
                <p class="card-text">Tel: ${contactTel}</p>
                <p class="card-text">Office: ${contactOfc}</p>
            </div>
        </div>
    </div>
    `
}


// runtime

    for (let i = 0; i < employeeList.length; i++) {
        let contactName = (employeeList[i].name).toProperCase();
        let contactTel = employeeList[i].phoneNum;
        let contactOfc = employeeList[i].officeNum;
        let contactPhoto = employeeList[i].profilePhoto;
        $('#contacts').append(tmplContactCard(contactName,contactTel,contactOfc,contactPhoto));
    }