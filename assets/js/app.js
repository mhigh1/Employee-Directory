// Add toProperCase property to string objects
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Contact Card Template
const tmplContactCard = function(contactName, contactTel, contactOfc, contactPhoto) {
    return `
    <div class="col-sm-12 col-md-6 col-lg-4">
        <div class="card p-3 mb-3">
            <img class="card-img-top rounded-circle m-auto w-75" src="./assets/images/photos/${contactPhoto}" alt="Employee Photo">
            <div class="card-body">
                <h5 class="card-title">${contactName}</h5>
                <ul class="list-group">
                    <li class="list-group-item border-0 p-0"><i class="fas fa-phone"></i> ${contactTel}</li>
                    <li class="list-group-item border-0 p-0"><i class="fas fa-building"></i> ${contactOfc}</li>
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
const filterObjectsByKey = function(array, key, value, exact) {
    
    let endChar = "";

    // escape special characters of input value for use in RegExp
    value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if(exact === true) {
        endChar = "$";        
    }

    const filterByKey = function(el) {
        if (String(el[key]).match(new RegExp('^' + value + endChar,'ig'))) {
          return true;
        }
        return false;
      }
    return array.filter(filterByKey);
}

// filter Contacts
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
    $('#result-bar').empty();
    $('#contacts').empty();
    if (results.length) {
        renderContacts(results);
    } else {
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic">No contacts found that matches search criteria '${criteria}'.</div>`);
    }
    $('#search').val('');
}

// Add Contact to employeeList Array
const addContact = function() {
    const name = $('#name').val();
    const phoneNumber = $('#phoneNumber').val();
    const officeNumber = $('#officeNumber').val();
    const objContact = {
        name: name,
        phoneNum: phoneNumber,
        officeNum: officeNumber,
        profilePhoto: 'defaultPhoto.png'
    }
    const results = filterObjectsByKey(employeeList, 'name', name, true);

    if (results.length === 0) {
        employeeList.unshift(objContact);
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic text-success">Added record for '${name}'.</div>`);
    } else {
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic text-danger">A record with the name '${name}' already exists.</div>`);
    }

    document.querySelector("form[name='frmAddContact']").reset(); // FIX: reset() not a method of querySelectorAll
}

// Verify Contact
const verifyContact = function() {
    const name = $('#txtNameToVerify').val();
    let results = filterObjectsByKey(employeeList, 'name', name, true);
    if(results.length === 1) {
        $('#result-bar').html(`<div class="px-3 pb-3 text-success"><i class="fas fa-check-circle"></i><span class="px-2">'${name}' verified!</span></div>`);
    } else if (results.length > 1 && !!name) {
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic">Found ${results.length} records using criteria '${name}'.</div>`);
        renderContacts(results);
    } else {
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic">Unable to find a record using criteria '${name}'.</div>`);
    }
    $('#txtNameToVerify').val('');
}

// Update a Contact
const updateContact = function() {
    const name = $('#emplName').val();
    const phoneNumber = $('#newPhoneNumber').val();
    const officeNumber = $('#newOfficeNumber').val();
    const results = filterObjectsByKey(employeeList, 'name', name, true);

    if(results.length === 1) {
        const pos = employeeList.map(contact => contact.name).indexOf(name);
        employeeList[pos].phoneNum = phoneNumber;
        employeeList[pos].officeNum = officeNumber;
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic text-success">Record for '${name}' updated.</div>`);
        renderContacts();
    } else if (results.length > 1 && !!name) {
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic text-warning">Found ${results.length} records using criteria '${name}'. Unable to update record.</div>`);
    } else {
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic">Unable to find a record using criteria '${name}'.</div>`);
    }

    document.querySelector("form[name='frmUpdate']").reset();
}

// Delete a Contact
const deleteContact = function() {
    const name = $('#txtNameToDelete').val();
    const results = filterObjectsByKey(employeeList, 'name', name, true);

    if(results.length === 1) {
        const pos = employeeList.map(contact => contact.name).indexOf(name);
        employeeList.splice(pos, 1);
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic text-success">Record for '${name}' deleted.</div>`);
        renderContacts();
    } else if (results.length > 1 && !!name) {
        $('#result-bar').html(`<div class="px-3 pb-3 font-italic text-warning">Found ${results.length} records using criteria '${name}'. Unable to delete record.</div>`);
    } else {
        $('#result-bar').html(`<div class="px-3 font-italic">Unable to find a record using criteria '${name}'.</div>`);
    }

    document.querySelector("form[name='frmDelete']").reset();
}

// CALLBACK FUNCTIONS //
// SideNav Event Actions
$('li#view').on('click', function() {
    $('form').addClass('d-none');
    $("form[name='frmSearch']").removeClass('d-none');
    $('#contents div').empty();
    renderContacts();
});

$('li#add').on('click',function() {
    $('form').addClass('d-none');
    $("form[name='frmAddContact']").removeClass('d-none');
    $('#contents div').empty();
    renderContacts();
});

$('li#verify').on('click',function() {
    $('form').addClass('d-none');
    $("form[name='frmVerify']").removeClass('d-none');
    $('#contents div').empty();
});

$('li#update').on('click',function() {
    $('form').addClass('d-none');
    $("form[name='frmUpdate']").removeClass('d-none');
    $('#contents div').empty();
    renderContacts();
});

$('li#delete').on('click',function() {
    $('form').addClass('d-none');
    $("form[name='frmDelete']").removeClass('d-none');
    $('#contents div').empty();
    renderContacts();
});

// Search for contacts by name, phone number, or office number
$("form[name='frmSearch']").on('submit', function(e){
    e.preventDefault();
    searchContacts();
    return false; 
});

// Add a contact record to employeeList array and render all contacts
$("form[name='frmAddContact']").on('submit', function(e){
    e.preventDefault();
    $('#contacts').empty();
    addContact();
    renderContacts();
    return false; 
});

// Verify a contact record exists, return yes or no
$("form[name='frmVerify']").on('submit',function(e){
    e.preventDefault();
    $('#contents div').empty();
    verifyContact();
    return false;
});

// Update a contact record and render all contacts
$("form[name='frmUpdate']").on('submit',function(e){
    e.preventDefault();
    $('#contents div').empty();
    updateContact();
    return false;
});

// Delete a contact record from employeeList array and render all contacts
$("form[name='frmDelete']").on('submit',function(e){
    e.preventDefault();
    $('#contents div').empty();
    deleteContact();
    return false;
});

// Override default form submit action on ENTER key
$('form').on('submit', function(e){
    e.preventDefault();
    return false; 
});

// runtime
renderContacts();