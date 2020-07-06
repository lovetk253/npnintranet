var spreadsheetId = '13p5xXxpzAm-led7aSz0cGLDXCjgp49FrnkcuR5xxF1o';
var range = "'" + 'Chi tiết' + "'!A:M";
var rangeNgayPhep = "'" + 'Ngày phép' + "'!A:AD";
var valueInputOption = 'USER_ENTERED'; /** [INPUT_VALUE_OPTION_UNSPECIFIED, RAW, USER_ENTERED] */
var insertDataOption = 'INSERT_ROWS'; /** [OVERWRITE, INSERT_ROWS] */
var dataOfUser = [];
$(function () {
  $('.input-daterange').datepicker({
    format: 'dd-mm-yyyy',
    autoclose: true,
    calendarWeeks: true,
    clearBtn: true,
    disableTouchKeyboard: true
  });
  addNguoiPheDuyet();
  document.getElementById("formYeucaunghiphep").onsubmit = function () {
    requestLeave();
    return false;
  };
  showRequest();

  document.getElementById("createRequest").onclick = function () {
    $("#modalRequest").modal();
    return false;
  };
  showDetailOfDay();
  $('a[href$="#modalDetailOfDay"]').on("click", function () {
    $('#modalDetailOfDay').modal();
  });
});

function requestLeave() {
  var data = JSON.parse(getValue('storageUserData'));
  var emailnguoigui = data.primaryEmail;
  var hotennguoigui = data.name.fullName;
  var now = new Date();
  var id = now.getFullYear() + "" + (now.getMonth() + 1) + "" + now.getDate() + "" + now.getHours() + "" + now.getMinutes() + "" + now.getSeconds() + "" + now.getMilliseconds()
  var tieude = document.getElementById('tieude').value;
  var mucdich = document.getElementById('mucdich').value;
  var hotennguoipheduyet = document.getElementById('nguoipheduyet').value.split(" - ")[0];
  var emailnguoipheduyet = document.getElementById('nguoipheduyet').value.split(" - ")[1]
  var loaixinnghi = document.getElementById('loaixinnghi').value;
  var thoigiannghi = document.getElementById('thoigiannghi').value;
  var thongbaocho = document.getElementById('thongbaocho').value;
  var tgbatdau = document.getElementById('tgbatdau').value;
  var tgketthuc = document.getElementById('tgketthuc').value;

  var jsonRequest = {
    "range": range,
    "majorDimension": "ROWS",
    "values": []
  }
  var arrayRequest = [id, hotennguoigui, emailnguoigui, tieude, mucdich, hotennguoipheduyet, emailnguoipheduyet, loaixinnghi, thoigiannghi, thongbaocho, tgbatdau, tgketthuc]
  jsonRequest.values.push(arrayRequest);
  var access = getValue("storageAccess");
  let PATH = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheetId + '/values/' + range + ':append?insertDataOption=' + insertDataOption + '&valueInputOption=' + valueInputOption + '&access_token=' + access;
  $.ajax({
    url: PATH,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(jsonRequest),
    dataType: 'json',
    success: function (data) {
      //sendMail(arrayRequest)
      $("#contentResult").html("");
      $("#contentResult").append("<div class='alert alert-success' role='alert'> Bạn đã gửi yêu cầu thành công!</div>");
      setTimeout(function () {
        location.reload(); //Refresh page
      }, 3000);
    },
    error: function (error) {
      $("#contentResult").append("<div class='alert alert-danger' role='alert'> Có lỗi trong quá trình thực hiện!</div>");
    }
  });
}

function showRequest(){
  var data = JSON.parse(getValue('storageUserData'));
  var email = data.primaryEmail;
  $.when(getRequest()).done(function (data) {
    if (data !== undefined && typeof data.valueRanges !== null && typeof data.valueRanges.values !== null && data.valueRanges.values !== '') {
      data.valueRanges[0].values.slice().reverse().forEach(row => {
        if (row[2] == email) {
          dataOfUser.push(row);
        }
      });
      insertDataTable(dataOfUser);
    }
  }).fail(function (error) {
    console.log(error);
  });
}

function getRequest() {
  var access = getValue("storageAccess");
  let PATH = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheetId + '/values:batchGet?&ranges='+ range + '&access_token=' + access;
  return $.ajax({
    url: PATH,
    type: "GET",
  });
}

function addNguoiPheDuyet() {
  var access = getValue("storageAccess");
  var userData = JSON.parse(getValue('storageUserData'));
  if (typeof userData.customSchemas !== 'undefined' && userData.customSchemas.manageOrgUnit.manageOrg.length > 0) {
    userData.customSchemas.manageOrgUnit.manageOrg.forEach(manage => {
      if (manage.value == userData.orgUnitPath) {
        $.when(getOrgUnitInLeave(userData.customerId, access)).done(function (data) {
          if (typeof data !== 'undefined' && data !== null && typeof data.organizationUnits !== 'undefined' && data.organizationUnits.length > 0) {
            data.organizationUnits.forEach(orgUnitPath => {
              if (orgUnitPath.orgUnitPath == userData.orgUnitPath && orgUnitPath.parentOrgUnitPath !== '/') {
                $.when(getManagerOfOrg(access, userData, orgUnitPath.parentOrgUnitPath)).done(function (other) {
                  if (other !== null && typeof other.users !== other.users.length > 0) {
                    other.users.forEach(user => {
                      var sel = document.getElementById('nguoipheduyet');
                      var opt = document.createElement('option');
                      opt.appendChild(document.createTextNode(user.name.fullName));
                      opt.value = user.name.fullName + " - " + user.primaryEmail;
                      opt.setAttribute("data-email", user.primaryEmail);
                      sel.appendChild(opt);
                    })
                  }
                }).fail(function (error) {
                  console.log(error);
                });
              }
            })
          }
        }).fail(function (error) {
          console.log(error);
        });
      }
    })
  } else {
    $.when(getManagerOfOrg(access, userData, userData.orgUnitPath)).done(function (data) {
      if (data !== null && typeof data.users !== data.users.length > 0) {
        data.users.forEach(user => {
          var sel = document.getElementById('nguoipheduyet');
          var opt = document.createElement('option');
          opt.appendChild(document.createTextNode(user.name.fullName));
          opt.value = user.name.fullName + " - " + user.primaryEmail;
          opt.setAttribute("data-email", user.primaryEmail);
          sel.appendChild(opt);
        })
      }
    }).fail(function (error) {
      console.log(error);
    });
  }
}

function getOrgUnitInLeave(customerId, access) {
  let PATH = 'https://www.googleapis.com/admin/directory/v1/customer/' + customerId + '/orgunits?access_token=' + access + '&type=all';
  return $.ajax({
    url: PATH,
    type: "GET"
  });
}

function getManagerOfOrg(access, data, orgUnitPath) {
  var domain = data.primaryEmail.split("@")[1];
  let PATH = 'https://www.googleapis.com/admin/directory/v1/users?access_token=' + access + '&domain=' + domain + '&query=manageOrgUnit.manageOrg=' + "'" + orgUnitPath + "'" + '&projection=full';
  return $.ajax({
    url: PATH,
    type: "GET",
  });
}

function getUserData(primaryEmail) {
  var a = getValue("storageAccess");
  var PATH = 'https://www.googleapis.com/admin/directory/v1/users/' + primaryEmail + '?access_token=' + a;
  return $.ajax({
    url: PATH,
    type: "GET",
  });
}

function insertDataTable(data) {
  var elem,
    dataFn = $('[data-fn="contacts"]'),
    thisUrl = dataFn.data('url');
  if (typeof $.table_of_contacts == 'undefined')
    $.table_of_contacts = {};
  $.table_of_contacts.get = {
    init: function () {
      if (dataFn) {
        this.getJson();
      } else {
        dataFn.html('No data found.');
      }
    },
    getJson: function (url) {
      var self = this;
      // loading data before
      dataFn.html('<span class="loading_table">' +
        'Loading Please Wait ....' +
        '</span>');
      $.ajaxSetup({
        cache: false
      });
      var out_html = self.tpl();
      $.each(data, function (i, obj) {
        out_html += self.tpl_inner(obj);
      });
      out_html += '</tbody>';
      dataFn.html(out_html);
    },
    tpl: function () {
      var html = '<thead>' +
        '<tr>' +
        '<th>Tiêu đề</th>' +
        '<th>Loại yêu cầu</th>' +
        '<th>Người phê duyệt</th>' +
        '<th>Trạng thái</th>' +
        '<th>Chi tiết</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody >';
      return html;
    },
    tpl_inner: function (obj) {
      if (typeof obj[12] == "undefined") {
        obj[12] = "Đợi phê duyệt";
      }
      var status = '';
      if (obj[12] == 'Đồng ý') {
        status = "label_success"
      }
      if (obj[12] == 'Đợi phê duyệt') {
        status = "label_warning"
      }
      if (obj[12] == 'Từ chối') {
        status = "label_danger"
      }
      if (obj[12] == 'Được phê duyệt') {
        status = "label_success"
      }
      var html = '<tr>' +
        '<td>' + obj[3] + '</td>' +
        '<td>' + obj[7] + '</td>' +
        '<td>' + obj[5] + '</td>' +
        '<td><span class="labelAlert ' + status + '">' + obj[12] + '</span></td>' +
        '<td>' +
        '<img class="infoUser" onclick="showDetailRequest(this)" data-toggle="modal" data-index="' + data.indexOf(obj) + '" src="images/info.png"></img>' +
        '</td>' +
        '</tr>';
      return html;
    }
  };
  // on ready render data
  $(document).ready(function () {
    $.table_of_contacts.get.init();
  });
};

function showDetailRequest(index) {
  var i = index.getAttribute("data-index");
  document.getElementById("inputTieuDe").value = dataOfUser[i][3];
  document.getElementById("inputMucDich").value = dataOfUser[i][4];
  document.getElementById("inputLoaiXinNghi").value = dataOfUser[i][7];
  document.getElementById("inputTgNghi").value = dataOfUser[i][8];
  document.getElementById("inputNguoiPheDuyet").value = dataOfUser[i][5];
  if (typeof dataOfUser[i][9] == 'undefined') dataOfUser[i][9] = '';
  document.getElementById("inputTbCho").value = dataOfUser[i][9];
  document.getElementById("inputTgBatDau").value = dataOfUser[i][10];
  document.getElementById("inputTgKetThuc").value = dataOfUser[i][11];
  if (typeof dataOfUser[i][12] == 'undefined') dataOfUser[i][12] = "Đợi phê duyệt";
  document.getElementById("inputTrangThai").value = dataOfUser[i][12];
  $("#exampleModalCenter").modal();
}

function resetModalRequest() {
  $(".exampleModalCenter").on("hidden.bs.modal", function () {
    $(".detailInfo").empty();
    $(".detailInfo").html('<div class="row" id="rowTieuDe"><label class="col-md-4">Tiêu đề</label><input class="col-md-7" id="inputTieuDe" placeholder="" disabled></input></div><div class="row" id="rowMucDich"><label class="col-md-4">Mục đích</label><input class="col-md-7" id="inputMucDich" placeholder="" disabled></input></div><div class="row" id="rowLoaiXinNghi"><label class="col-md-4">Loại xin nghỉ</label><input class="col-md-7" id="inputLoaiXinNghi" placeholder="" disabled></input></div><div class="row" id="rowTgNghi"><label class="col-md-4">Thời gian nghỉ</label><input class="col-md-7" id="inputTgNghi" placeholder="" disabled></input></div><div class="row" id="rowNguoiPheDuyet"><label class="col-md-4">Người phê duyệt</label><input class="col-md-7" id="inputNguoiPheDuyet" placeholder=""disabled></input></div><div class="row" id="rowTbCho"><label class="col-md-4">Thông báo cho</label><input class="col-md-7" id="inputTbCho" placeholder="" disabled></input></div><div class="row" id="rowTgBatDau"><label class="col-md-4">Thời gian bắt đầu</label><input class="col-md-7" id="inputTgBatDau" placeholder=""disabled></input></div><div class="row" id="rowTgKetThuc"><label class="col-md-4">Thời gian kết thúc</label><input class="col-md-7" id="inputTgKetThuc" placeholder=""disabled></input></div><div class="row" id="rowTrangThai"><label class="col-md-4">Trạng thái</label><input class="col-md-7" id="inputTrangThai" placeholder=""disabled></input></div>');
  });
  $("#exampleModalCenter").modal('hide');
}

function closeModalRequest() {
  $('#modalRequest').on('hidden.bs.modal', function (e) {
    $(this)
      .find("input,textarea,select")
      .val('')
      .end()
  })
  $("#contentResult").html("");
  $("#modalRequest").modal('hide');

}

function showDetailOfDay() {
  var data = JSON.parse(getValue('storageUserData'));
  var email = data.primaryEmail;
  $.when(getDetailDay()).done(function (data) {
    if (typeof data.valueRanges !== "undefined" && data.valueRanges.length > 0 && typeof data.valueRanges[0].values !== "undefined" && data.valueRanges[0].values.length > 0) {
      data.valueRanges[0].values.forEach(row => {
        if (row[2] == email) {
          insertTableDetail(row);
          document.getElementById("detailOfDay").style.display = "inline";
        }
      })
    }
  }).fail(function (error) {
    console.log(error);
  });
}
function getDetailDay(){
  var access = getValue("storageAccess");
  let PATH = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheetId + '/values:batchGet?&ranges=' + rangeNgayPhep + '&access_token=' + access;
  return $.ajax({
    url: PATH,
    type: "GET",
  });
}


function insertTableDetail(data) {
  document.getElementById("textOfDay").innerHTML = 'Số ngày phép còn lại: ' + data[5];
  var elem,
    dataFn = $('[data-fn="detaiOfDays"]'),
    thisUrl = dataFn.data('url');
  if (typeof $.table_of_contacts == 'undefined')
    $.table_of_contacts = {};
  $.table_of_contacts.get = {
    init: function () {
      if (dataFn) {
        this.getJson();
      } else {
        dataFn.html('No data found.');
      }
    },
    getJson: function (url) {
      var self = this;
      // loading data before
      dataFn.html('<span class="loading_table">' +
        'Loading Please Wait ....' +
        '</span>');
      $.ajaxSetup({
        cache: false
      });
      var out_html = self.tpl()
      out_html += self.tpl_inner(data);
      dataFn.html(out_html);
    },
    tpl: function () {
      var html =
        '<tr>' +
        '<th></th>' +
        '<th>Tháng 1</th>' +
        '<th>Tháng 2</th>' +
        '<th>Tháng 3</th>' +
        '<th>Tháng 4</th>' +
        '<th>Tháng 5</th>' +
        '<th>Tháng 6</th>' +
        '<th>Tháng 7</th>' +
        '<th>Tháng 8</th>' +
        '<th>Tháng 9</th>' +
        '<th>Tháng 10</th>' +
        '<th>Tháng 11</th>' +
        '<th>Tháng 12</th>' +
        '</tr>';
      return html;
    },
    tpl_inner: function (obj) {
      for (var k = 0; k < 30; k++) {
        if (obj[k] == undefined) {
          obj[k] = "";
        }
      }
      var html = '<tr>' +
        '<th>' + 'Nghỉ phép' + '</th>' +
        '<td>' + obj[6] + '</td>' +
        '<td>' + obj[8] + '</td>' +
        '<td>' + obj[10] + '</td>' +
        '<td>' + obj[12] + '</td>' +
        '<td>' + obj[14] + '</td>' +
        '<td>' + obj[16] + '</td>' +
        '<td>' + obj[18] + '</td>' +
        '<td>' + obj[20] + '</td>' +
        '<td>' + obj[22] + '</td>' +
        '<td>' + obj[24] + '</td>' +
        '<td>' + obj[26] + '</td>' +
        '<td>' + obj[28] + '</td>' +
        '</tr>' + '<tr>' +
        '<th>' + 'Nghỉ không lương' + '</th>' +
        '<td>' + obj[7] + '</td>' +
        '<td>' + obj[9] + '</td>' +
        '<td>' + obj[11] + '</td>' +
        '<td>' + obj[13] + '</td>' +
        '<td>' + obj[15] + '</td>' +
        '<td>' + obj[17] + '</td>' +
        '<td>' + obj[19] + '</td>' +
        '<td>' + obj[21] + '</td>' +
        '<td>' + obj[23] + '</td>' +
        '<td>' + obj[25] + '</td>' +
        '<td>' + obj[27] + '</td>' +
        '<td>' + obj[29] + '</td>' +
        '</tr>';
      return html;
    }
  };
  // on ready render data
  $(document).ready(function () {
    $.table_of_contacts.get.init();
  });
};
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