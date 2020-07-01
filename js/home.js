var access = '';
var userData;
var GoogleAuth;
var primaryEmail = '';
var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/admin.directory.orgunit https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/admin.directory.group.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/admin.directory.userschema';

function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
}

function initClient() {
    // Retrieve the discovery document for version 3 of Google Drive API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyAUX-GeTCdEoLwp4BfkTTuhN3s35iNWOes',
        'clientId': '169205259825-5j8krgkd27aqr3inig1h6psr6c758rfb.apps.googleusercontent.com',
        'discoveryDocs': [discoveryUrl],
        'scope': SCOPE
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
        // console.log(gapi.getAuthResponse(true).access_token);

        // Handle initial sign-in state. (Determine if user is already signed in.)
        //var user = GoogleAuth.currentUser.get();
        setSigninStatus();

        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function () {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function () {
            revokeAccess();
        });


    });

}

function renderButton() {
    gapi.signin2.render('sign-in-or-out-button', {
        'scope': SCOPE,
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
    });
}

function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked "Sign out" button.
        GoogleAuth.signOut();
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();


    }
}

function revokeAccess() {
    GoogleAuth.disconnect();
}

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    if (typeof user.getBasicProfile() !== "undefined") {
        primaryEmail = user.getBasicProfile().getEmail();
        console.log(user.getBasicProfile().getImageUrl());
    }
    localStorage.setItem("storageEmail", primaryEmail);
    if (!user.getAuthResponse(true) == '') {
        access = user.getAuthResponse(true).access_token;
        localStorage.setItem("storageAccess", user.getAuthResponse(true).access_token);
    }

    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $.when(getUserData(primaryEmail)).done(function (data) {
            data["imageUrl"] = user.getBasicProfile().getImageUrl();
            console.log(data["imageUrl"]);
            //localStorage.setItem("storageUserData", data);
            localStorage.setItem('storageUserData', JSON.stringify(data));
            localStorage.setItem('storageInput', '');
            window.location.replace("https://sites.google.com/devop.com.vn/intranet/home");
        });
    } else {
        //alert('Ban chua dang nhap!');
    }
}

function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}

function getUserData(primaryEmail) {
    //var userKey = document.getElementById("inputUser").value;
    var a = localStorage.getItem("storageAccess");
    var PATH = 'https://www.googleapis.com/admin/directory/v1/users/' + primaryEmail + '?access_token=' + a + '&projection=full';
    return $.ajax({
        url: PATH,
        type: "GET",
    });
}
//localStorage.setItem("storageUserData", userData);
function getOrgUnit() {
    primaryEmail = localStorage.getItem('storageEmail');
    $.when(getUserData(primaryEmail)).done(function (data) {
        if (!data == '') {
            customerId = data["customerId"];
            a = localStorage.getItem("storageAccess");
            let PATH = 'https://www.googleapis.com/admin/directory/v1/customer/' + customerId + '/orgunits?access_token=' + a + '&orgUnitPath=/&type=all';
            $.ajax({
                url: PATH,
                type: "GET",
                success: function (data) {
                    var dataOrgUnit = data["organizationUnits"];
                    var dataOrgUnitSort = dataOrgUnit.sort((a, b) => (a["orgUnitPath"] > b["orgUnitPath"]) ? 1 : -1)
                    console.log(dataOrgUnitSort);
                    dataOrgUnitSort.forEach(organizationUnits => {
                        var orgParentId = organizationUnits["parentOrgUnitId"].replace(/\W/g, '');
                        var orgId = organizationUnits["orgUnitId"].replace(/\W/g, '');
                        if (organizationUnits["parentOrgUnitPath"] == "/") {
                            if (document.getElementById(orgId) == null) {
                                $("#demo").append('<li class="list-group-item"><div class="panel-heading"><div class="panel-title"><a data-toggle="collapse" href="#div' + orgId + '">' + organizationUnits["name"] + '</a></div></div><div id="div' + orgId + '" class="panel-collapse collapse"><ul class="list-group" id="' + orgId + '"></ul></div></li>');
                            }
                        } else {
                            if (document.getElementById(orgId) == null) {
                                $('#' + orgParentId).append('<li class="list-group-item"><div class="panel-heading"><div class="panel-title"><a data-toggle="collapse" href="#div' + orgId + '">' + organizationUnits["name"] + '</a></div></div><div id="div' + orgId + '" class="panel-collapse collapse"><ul class="list-group" id="' + orgId + '"></ul></div></li>')
                            }
                        }
                    });


                },
                error: function (error) {
                    console.log("Something went wrong", error);
                }
            });
        }

    });
}

function getGroup() {
    a = localStorage.getItem("storageAccess");
    let PATH = 'https://www.googleapis.com/admin/directory/v1/groups/dev.group@devops.net.vn?access_token=' + a;
    $.ajax({
        url: PATH,
        type: "GET",
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log("Something went wrong", error);
        }
    });
}

function createUser() {
    var json = {
        "name": {
            "familyName": "",
            "givenName": "",
        },
        "password": "",
        "primaryEmail": "",
    }
    var familyName = document.getElementById("familyName").value;
    var givenName = document.getElementById("givenName").value;
    var password = document.getElementById("password").value;
    var primaryEmail = document.getElementById("primaryEmail").value;
    json.name.familyName = familyName;
    json.name.givenName = givenName;
    json.password = password;
    json.primaryEmail = primaryEmail;
    var a = localStorage.getItem("storageAccess");
    console.log(a);

    let PATH = 'https://www.googleapis.com/admin/directory/v1/users?access_token=' + a;
    $.ajax({
        url: PATH,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(json),
        dataType: 'json',
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log("Something went wrong", error);
        }
    });
}