// Add toProperCase property to string objects
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Contact Card Template
const tmplContactCard = function(contactName, contactTel, contactOfc, contactPhoto) {
    return `
    <div class="col-sm-4">
        <div class="card p-3 mb-3">
            <img class="card-img-top rounded-circle m-auto w-75" src="./assets/images/photos/${contactPhoto}" alt="Employee Photo">
            <div class="card-body">
                <h5 class="card-title">${contactName}</h5>
                <ul class="list-group">
                    <li class="list-group-item border-0 p-0">Tel: ${contactTel}</li>
                    <li class="list-group-item border-0 p-0">Office: ${contactOfc}</li>
                <ul>
            </div>
        </div>
    </div>
    `
}

// Render the Contacts List
const renderContacts = function(array) {
    
    // if no array is provided default to all contacts (employeeList)
    if (!array) {
        array = employeeList;
    }

    for (let i = 0; i < array.length; i++) {
        let contactName = (array[i].name).toProperCase();
        let contactTel = array[i].phoneNum;
        let contactOfc = array[i].officeNum;
        let contactPhoto = array[i].profilePhoto;
        $('#contacts').append(tmplContactCard(contactName,contactTel,contactOfc,contactPhoto));
    }
}

// filter an array of objects based on key
const filterObjectsByKey = function(array, key, value) {
    
    // escape special characters of input value for use in RegExp
    value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const filterByKey = function(el) {
        if (String(el[key]).match(new RegExp('^' + value,'i'))) {
          return true;
        }
        return false;
      }
    return array.filter(filterByKey);
}

// Search Contacts
const filterContacts = function(value) {
    let key;
    switch(true) {
        case /^[a-zA-Z]+$/.test(value):
            key = 'name';
            break;

        case /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(value):
            key = 'phoneNum';
            break;

        case /^\d{1,4}$/.test(value):
            key = 'officeNum';
            break;

        default:
            key = 'name';
    }
    return filterObjectsByKey(employeeList, key, value);
}

// Search Contacts Operation
const searchContacts = function() {
    let criteria = $('#search').val();
    let results = filterContacts(criteria);
    $('#contacts').empty();
    if (results.length) {
        renderContacts(results);
    } else {
        $('#contacts').html(`<div class="px-3 font-italic">No contacts found that matches search criteria '${criteria}'.</div>`);
    }
    $('#search').val('');
}

// Add Contact to employeeList Array
const addContact = function() {
    const firstName = $('#name').val();
    const phoneNumber = $('#phoneNumber').val();
    const officeNumber = $('#officeNumber').val();
    const objContact = {
        name: firstName,
        phoneNum: phoneNumber,
        officeNum: officeNumber,
        profilePhoto: 'defaultPhoto.png'
    }
    employeeList.push(objContact);
}

// CALLBACK FUNCTIONS //
// SideNav Event Actions
$('li#view').on('click', function() {
    $('#frmSearch').removeClass('d-none');
    $('#frmAddContact').addClass('d-none');
    $('#contacts').empty();
    renderContacts();
});

$('li#add').on('click',function() {
    $('#frmSearch').addClass('d-none');
    $('#frmAddContact').removeClass('d-none');
    $('#contacts').empty();
});

// Search for contacts by name, phone number, or office number
$('#btnSearch').on('click', searchContacts);

// Add a contact record to employeeList array and render all contacts
$('#btnAddContact').on('click', function() {
    if ($('#name').val()) {
        addContact();
        $('#contacts').empty();
        renderContacts(employeeList);
    }
});

// Delete a contact record from employeeList array and render all contacts


// Override default form submit action on ENTER key
$('#frmSearch').on('submit', function(e){
    e.preventDefault();
    searchContacts();
    return false; 
});

// runtime
renderContacts();