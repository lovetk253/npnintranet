$(function () {
    getOrgUnit();
    //$(".dropdown-toggle").dropdown();
});

function getUserData(primaryEmail) {
    var a = getValue("storageAccess");
    var PATH = 'https://www.googleapis.com/admin/directory/v1/users/' + primaryEmail + '?access_token=' + a + '&projection=full';
    return $.ajax({
        url: PATH,
        type: "GET",
    });
}

function getAllUserData() {
    var a = getValue("storageAccess");
    var data = JSON.parse(getValue('storageUserData'));
    var domain = data.primaryEmail.split("@")[1];
    var PATH = 'https://www.googleapis.com/admin/directory/v1/users/?domain=' + domain + '&access_token=' + a;
    return $.ajax({
        url: PATH,
        type: "GET",
    });
}

function getOrgUnit() {
    primaryEmail = getValue('storageEmail');
    $.when(getUserData(primaryEmail)).done(function (data) {
        if (!data == '') {
            customerId = data["customerId"];
            a = getValue("storageAccess");
            let PATH = 'https://www.googleapis.com/admin/directory/v1/customer/' + customerId + '/orgunits?access_token=' + a + '&orgUnitPath=/&type=all';
            $.ajax({
                url: PATH,
                type: "GET",
                success: function (data) {
                    var dataOrgUnit = data["organizationUnits"];
                    var dataOrgUnitSort = dataOrgUnit.sort((a, b) => (a["orgUnitPath"] > b["orgUnitPath"]) ? 1 : -1)
                    //console.log(dataOrgUnitSort);
                    dataOrgUnitSort.forEach(organizationUnits => {
                        var orgParentId = organizationUnits["parentOrgUnitId"].replace(/\W/g, '');
                        var orgId = organizationUnits["orgUnitId"].replace(/\W/g, '');
                        if (organizationUnits["parentOrgUnitPath"] == "/") {
                            if (document.getElementById(orgId) == null) {
                                $("#demo").append('<li class="list-group-item"><div class="panel-heading"><div class="panel-title"><span class="arrow-down collapsed" data-toggle="collapse" href="#div' + orgId + '" aria-expanded="false"></span><a class="pointer" onclick="getUserInOrgUnit(this)" data-path="' + organizationUnits["orgUnitPath"] + '">' + organizationUnits["name"] + '</a></div></div><div id="div' + orgId + '" class="panel-collapse collapse"><ul class="list-group list-group-flush" id="' + orgId + '"></ul></div></li>');
                            }
                        } else {
                            if (organizationUnits.orgUnitPath.split("/").length - 1 < 4) {
                                if (document.getElementById(orgId) == null) {
                                    $('#' + orgParentId).append('<li class="list-group-item"><div class="panel-heading"><div class="panel-title"><span class="arrow-down collapsed" data-toggle="collapse" href="#div' + orgId + '" aria-expanded="false"></span><a class="pointer" onclick="getUserInOrgUnit(this)" data-path="' + organizationUnits["orgUnitPath"] + '">' + organizationUnits["name"] + '</a></div></div><div id="div' + orgId + '" class="panel-collapse collapse"><ul class="list-group list-group-flush" id="' + orgId + '"></ul></div></li>')
                                }
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

function getAllUserDataInOrg(path) {
    var a = getValue("storageAccess");
    var data = JSON.parse(getValue('storageUserData'));
    var domain = data.primaryEmail.split("@")[1];
    var PATH = 'https://www.googleapis.com/admin/directory/v1/users?domain=' + domain + '&access_token=' + a + '&query=orgUnitPath=' + "'" + path + "'";
    return $.ajax({
        url: PATH,
        type: "GET",
    });
}

function getUserInOrgUnit(path) {
    var pathOfUser = path.getAttribute("data-path");
    var userPath = [];
    var table = document.getElementById("userInOrgUnit").getElementsByTagName('tbody')[0];
    var data = JSON.parse(getValue('storageUserData'));
    var isAdmin = data.isAdmin;
    $("#userInOrgUnit").find("tbody").empty();
    var numberOfUser = 0;
    $.when(getAllUserDataInOrg(pathOfUser)).done(function (data) {
        if (data !== null && typeof data.users !== 'undefined' && data.users.length > 0) {
            data.users.forEach(user => {
                userPath.push(user);
                fillUserInTableInOrg(isAdmin, user, table, pathOfUser);
                numberOfUser++;
            });
            // localStorage.setItem('storageDSUserData', JSON.stringify(userPath));
            document.cookie = "storageDSUserData="+JSON.stringify(userPath);
            document.getElementById("numberOfUser").innerHTML = 'Tổng số nhân viên: ' + numberOfUser;
        } else {
            document.getElementById("numberOfUser").innerHTML = 'Tổng số nhân viên: 0';
        }
    });
}

function showInfoUser(thisEmail) {
    var email = thisEmail.getAttribute("data-email");
    $.when(getUserData(email)).done(function (data) {
        if (!data == '') {
            //console.log(data);
            document.getElementById("inputFullName").setAttribute('placeholder', data.name.fullName);
            if (!data.phones == "") {
                data.phones.forEach(phone => {
                    if (document.getElementById("inputPhone").getAttribute("placeholder") == '') {
                        document.getElementById("inputPhone").setAttribute('placeholder', phone.value + ' - ' + phone.type);
                    }
                    if (phone.value !== data.phones[0].value) {
                        $('#rowPhone').after('<div class="row"><label class="col-md-3"></label><input class="col-md-8" placeholder="' + phone.value + ' - ' + phone.type + '" disabled></input></div>')
                    }
                });
            }

            document.getElementById("inputEmail").setAttribute('placeholder', data.primaryEmail);
            if (!data.emails == "" && data.emails.length > 0) {
                data.emails.forEach(email => {
                    if (email.address !== data.primaryEmail) {
                        $('#rowEmail').after('<div class="row"><label class="col-md-3"></label><input class="col-md-8" placeholder="' + email.address + '" disabled></input></div>')
                    }
                });
            }
            if (!data.addresses == "") {
                data.addresses.forEach(address => {
                    if (document.getElementById("inputAddress").getAttribute("placeholder") == '') {
                        document.getElementById("inputAddress").setAttribute('placeholder', address.formatted + ' - ' + address.type);
                    }
                    if (address.formatted !== data.addresses[0].formatted) {
                        $('#rowAddress').after('<div class="row"><label class="col-md-3"></label><input class="col-md-8" placeholder="' + address.formatted + ' - ' + address.type + '" disabled></input></div>')
                    }
                });
            }
            if (typeof data.externalIds !== 'undefined') {
                document.getElementById("inputEmployeeId").setAttribute('placeholder', data.externalIds[0].value);
            }
            if (typeof data.organizations !== 'undefined') {
                document.getElementById("inputJobTitle").setAttribute('placeholder', data.organizations[0].title);
                document.getElementById("inputDepartment").setAttribute('placeholder', data.organizations[0].department);
            }
        }
        $("#exampleModalCenter").modal();
    });
}

function resetModal() {
    $(".modal").on("hidden.bs.modal", function () {
        $(".modal-body").html('<div class="row" id="rowFullName">   <label class="col-md-3">Họ tên</label>    <input class="col-md-8" id="inputFullName" placeholder="" disabled></input></div><div class="row" id="rowPhone">    <label class="col-md-3">Số điện thoại</label><input class="col-md-8" id="inputPhone" placeholder="" disabled></input></div><div class="row" id="rowEmail">    <label class="col-md-3">Email</label>    <input class="col-md-8" id="inputEmail" placeholder="" disabled></input></div><div class="row" id="rowAddress">    <label class="col-md-3">Địa chỉ</label>    <input class="col-md-8" id="inputAddress" placeholder="" disabled></input></div><div class="row" id="rowEmployeeId">    <label class="col-md-3">Mã nhân viên</label>    <input class="col-md-8" id="inputEmployeeId" placeholder="" disabled></input></div><div class="row" id="rowJobTitle">    <label class="col-md-3">Chức Vụ</label><input class="col-md-8" id="inputJobTitle" placeholder="" disabled></input></div><div class="row" id="rowDepartment">    <label class="col-md-3">Phòng ban</label>    <input class="col-md-8" id="inputDepartment" placeholder="" disabled></input></div>');
    });
    $("#exampleModalCenter").modal('hide');
}

function fillUserInTableInOrg(isAdmin, user, table, path) {
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = user.name.familyName;
    cell2.innerHTML = user.name.givenName;
    if (isAdmin && path !== '') {
        cell3.innerHTML = user.primaryEmail + '<img class="infoUser hello" data-toggle="dropdown" src="images/info.png"><div class="dropdown-menu" style=""><a class="dropdown-item" onclick="showInfoUser(this)" data-toggle="modal" data-email="' + user.primaryEmail + '" href="#">Thông tin chi tiết</a><a class="dropdown-item" onclick="setMangerOfOrgUnit(this)" data-email="' + user.primaryEmail + '" data-role="Trưởng phòng" data-path="' + path + '" href="#">Đặt làm trưởng phòng</a><a class="dropdown-item" onclick="setMangerOfOrgUnit(this)" data-email="' + user.primaryEmail + '" data-role="Phó phòng" data-path="' + path + '" href="#">Đặt làm phó phòng</a></div> ';
    } else {
        cell3.innerHTML = user.primaryEmail + '<img class="infoUser" onclick="showInfoUser(this)" data-toggle="modal" data-email="' + user["primaryEmail"] + '"src="images/info.png"></img>';
    }
}

function setMangerOfOrgUnit(value) {
    var pathOfOrg = value.getAttribute("data-path");
    var role = value.getAttribute("data-role");
    var email = value.getAttribute("data-email");
    $.when(searchSchema()).done(function (data) {
        console.log(data);
        $.when(updateRoleOrgForUser(pathOfOrg, role, email)).done(function (data) {
            console.log("ok-exists")
        }).fail(function (error) {
            console.log(error);
        });
    }).fail(function (error) {
        $.when(createSchema()).done(function (data) {
            $.when(updateRoleOrgForUser(pathOfOrg, role, email)).done(function (data) {
                console.log("ok")
            }).fail(function (error) {
                console.log(error);
            });
        }).fail(function (error) {

        });
    });

}

function updateRoleOrgForUser(pathOfOrg, role, email) {
    var access_token = getValue("storageAccess");
    var dataUser;
    $.when(getUserData(email)).done(function (data) {
        dataUser = data;
        var allRole = '';
        var newRole = {
            "type": "custom",
            "value": "",
            "customType": ""
        };
        newRole.value = pathOfOrg ;
        newRole.customType = role;
        if (typeof dataUser.customSchemas !== 'undefined') {
            var checkExists = false;
            dataUser.customSchemas.manageOrgUnit.manageOrg.forEach(oneRole => {
                if (oneRole.value == newRole.value) {
                    checkExists = true;
                }
            })
            if (!checkExists) {
                dataUser.customSchemas.manageOrgUnit.manageOrg.push(newRole);
            }
        } else {
            dataUser = {
                "customSchemas": {
                    "manageOrgUnit": {
                        "manageOrg": [{
                            "type": "custom",
                            "customType": role,
                            "value": pathOfOrg
                        }]
                    }
                }
            }
        }
        var PATH = 'https://www.googleapis.com/admin/directory/v1/users/' + email + '?access_token=' + access_token;
        return $.ajax({
            url: PATH,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(dataUser),
            dataType: 'json'
        });
    }).fail(function (error) {
        console.log(error);
    });
}

function searchSchema() {
    var access_token = getValue("storageAccess");
    var data = JSON.parse(getValue('storageUserData'));
    var customerId = data.customerId;
    var PATH = 'https://www.googleapis.com/admin/directory/v1/customer/' + customerId + '/schemas/manageOrgUnit?access_token=' + access_token;
    return $.ajax({
        url: PATH,
        type: "GET",
    });
}

function createSchema() {
    var access_token = getValue("storageAccess");
    var data = JSON.parse(getValue('storageUserData'));
    var customerId = data.customerId;
    var dataSchema = '{"displayName":"Manage Org Unit","fields":[{"displayName":"Manage Org","fieldName":"manageOrg","fieldType":"STRING","indexed": true,"multiValued":true}],"schemaName":"manageOrgUnit"}';
    var PATH = 'https://www.googleapis.com/admin/directory/v1/customer/' + customerId + '/schemas?access_token=' + access_token;
    return $.ajax({
        url: PATH,
        type: "POST",
        contentType: "application/json",
        data: dataSchema,
        dataType: 'json',
    });
}

function showInfoAllUser() {
    var data = JSON.parse(getValue('storageUserData'));
    var isAdmin = data.isAdmin;
    var table = document.getElementById("userInOrgUnit").getElementsByTagName('tbody')[0];
    $("#userInOrgUnit").find("tbody").empty();
    var numberOfUser = 0;
    $.when(getAllUserData()).done(function (data) {
        if (!data == '') {
            users = data["users"];
            users.forEach(user => {
                fillUserInTableInOrg(isAdmin, user, table, "");
                numberOfUser++;
            });
            document.getElementById("numberOfUser").innerHTML = 'Tổng số nhân viên: ' + numberOfUser;
            // localStorage.setItem('storageDSUserData', JSON.stringify(users));
            document.cookie = "storageDSUserData="+JSON.stringify(userPath);
        }
    });
}

function getObjects(obj, key, val) {
    var result = false;
    if (key = "fullName") {
        if (obj.name.fullName.includes(val)) {
            result = true;
        }
    }
    if (key = "primaryEmail") {
        if (obj.primaryEmail.includes(val)) {
            result = true;
        }
    }
    if (key = "address") {
        if (typeof obj.emails !== "undefined" && obj.emails.length > 0) {
            obj.emails.forEach(email => {
                if (email.address.includes(val)) {
                    result = true;
                }
            })
        }
    }
    if (key = "value") {
        if (typeof obj.phones !== "undefined" && obj.phones.length > 0) {
            obj.phones.forEach(phone => {
                if (phone.value.includes(val)) {
                    result = true;
                }
            })
        }
    }
    return result;
}

function searchUser() {
    var data = JSON.parse(getValue('storageUserData'));
    var isAdmin = data.isAdmin;
    var dsUserJson = getValue('storageDSUserData');
    var dsUser = JSON.parse(dsUserJson);
    var keyArr = ["fullName", "primaryEmail", "address", "value"];
    var input = $('#inputSearchInOrg').val();
    var userArr = [];
    if (input !== "") {
        keyArr.forEach(key => {
            dsUser.forEach(user => {
                var check = getObjects(user, key, input);
                if (check) {
                    if (userArr.length > 0) {
                        var exists = true;
                        userArr.forEach(checkUser => {
                            if (checkUser.primaryEmail == user.primaryEmail) {
                                exists = false;
                            }
                        });
                        if (exists) {
                            userArr.push(user);
                        }
                    } else {
                        userArr.push(user);
                    }
                }
            })
        })
    } else {
        userArr = dsUser;
    }
    var table = document.getElementById("userInOrgUnit").getElementsByTagName('tbody')[0];
    $("#userInOrgUnit").find("tbody").empty();
    userArr.forEach(user => {
        fillUserInTableInOrg(isAdmin, user, table, "");
    });
    document.getElementById("numberOfUser").innerHTML = 'Tổng số nhân viên: ' + userArr.length;
}
function getValue(key){
    allCookies = document.cookie.split(';');
    value ='';
    allCookies.forEach(item =>{
        if(item.trim().startsWith(key)){
            value = item;
        }
    })
    return value.split("=")[1];
}