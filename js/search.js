var input = '';
$(function () {
    var input = localStorage.getItem("storageInput");
    if (input !== null && input !== '') {
        search(input);
    }
});
function searchOnTop() {
    var inputInSearch = document.getElementById("inputSearch");
    if (inputInSearch !== null) {
        if (input == null || input == '') {
            input = inputInSearch.value;
        }
    }
    localStorage.setItem('storageInput', input);
    window.location.replace("search.html");
}
function searchInPage() {
    var input = document.getElementById("inputSearch").value;
    search(input);
    localStorage.setItem('storageInput', input);
}
function searchByOnChange() {
    var input = localStorage.getItem("storageInput");
    search(input);
}
function search(input) {
    var maxResults = '';
    var pageToken = '';
    var findMaxResult = document.getElementById("dropdownMaxResult");
    if (findMaxResult !== null) {
        maxResults = findMaxResult.value;
    }
    var findPageToken = document.getElementById("nextPage");
    if (findPageToken !== null && findPageToken.getAttribute("data-pagetoken") !== "undefined") {
        pageToken = findPageToken.getAttribute("data-pagetoken");
    }
    var data = JSON.parse(localStorage.getItem('storageUserData'));
    var query = '';
    var checkTable = document.getElementById("userInSearch");
    if (checkTable !== null) {
        var table = document.getElementById("userInSearch").getElementsByTagName('tbody')[0];
        $("#userInSearch").find("tbody").empty();
        if (data !== null) {
            var domain = data.primaryEmail.split("@")[1];
            if (!isNaN(input)) {
                query = 'phone=' + input;
            } else {
                query = input;
            }
            $.when(getAllUserDataInSearch(domain, maxResults, pageToken, query)).done(function (data) {
                if (data !== null && data.users !== undefined) {
                    data.users.forEach(user => {
                        fillUserInTable(user, table);
                    })
                }
                if (typeof data.nextPageToken !== null && data.nextPageToken !== '') {
                    findPageToken.setAttribute('data-pagetoken', data.nextPageToken);
                }
            });
        }
    }

}
function clickButton(e) {
    if (e.keyCode == 13) {
        searchOnTop();
        return false;
    }
}
function clickButtonInPage(e) {
    if (e.keyCode == 13) {
        searchInPage();
        return false;
    }
}
function getAllUserDataInSearch(domain, maxResults, pageToken, query) {
    var access = localStorage.getItem("storageAccess");
    var PATH = 'https://www.googleapis.com/admin/directory/v1/users/?domain=' + domain + '&access_token=' + access + '&query=' + query;
    if (maxResults !== '') {
        PATH += '&maxResults=' + maxResults;
        if (pageToken !== '') {
            PATH += '&pageToken=' + pageToken;
        }
    }
    return $.ajax({
        url: PATH,
        type: "GET",
    });
}

function fillUserInTable(user, table) {
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = user["name"]["familyName"];
    cell2.innerHTML = user["name"]["givenName"];
    cell3.innerHTML = user["primaryEmail"] + '<img class="infoUser" onclick="showInfoUser(this)" data-toggle="modal" data-email="' + user["primaryEmail"] + '"src="images/info.png"></img>';
}
