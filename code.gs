function composeToManager(e) {
 var ActiveSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Chi tiết");
 var StartRow = 2;
 var RowRange = ActiveSheet.getLastRow() - StartRow + 1;
 var WholeRange = ActiveSheet.getRange(StartRow, 1, RowRange, 13);
 var AllValues = WholeRange.getValues();
 var message = "";
 for (i in AllValues) {
  var CurrentRow = AllValues[i];
  var EmailSent = CurrentRow[22];
  if (EmailSent == "Sent")
   continue;
  var linkOk = "https://script.google.com/a/devop.com.vn/macros/s/AKfycbx2WpYl_wlne_nBH46KnQawWC55FhDgNH0Ni0fTwd1eJC7IEalO/exec?id=" + CurrentRow[0] + "&ssId=13p5xXxpzAm-led7aSz0cGLDXCjgp49FrnkcuR5xxF1o&status=1";
  var linkNOk = "https://script.google.com/a/devop.com.vn/macros/s/AKfycbx2WpYl_wlne_nBH46KnQawWC55FhDgNH0Ni0fTwd1eJC7IEalO/exec?id=" + CurrentRow[0] + "&ssId=13p5xXxpzAm-led7aSz0cGLDXCjgp49FrnkcuR5xxF1o&status=2";
  var linkApprove = "https://script.google.com/a/devop.com.vn/macros/s/AKfycbx2WpYl_wlne_nBH46KnQawWC55FhDgNH0Ni0fTwd1eJC7IEalO/exec?id=" + CurrentRow[0] + "&ssId=13p5xXxpzAm-led7aSz0cGLDXCjgp49FrnkcuR5xxF1os&status=3";
  var tgBatDau = convertDate(CurrentRow[10]);
  var tgKetThuc = convertDate(CurrentRow[11]);
  message =
   "<p><b>Tiêu để: " + CurrentRow[3] + "</p>" +
   "<p><b>Mục đích: " + CurrentRow[4] + "</p>" +
   "<p><b>Người phê duyệt: " + CurrentRow[5] + "</p>" +
   "<p><b>Loại xin nghỉ: " + CurrentRow[7] + "</p>" +
   "<p><b>Thời gian nghỉ: " + CurrentRow[8] + "</p>" +
   "<p><b>Thông báo cho: " + CurrentRow[9] + "</p>" +
   "<p><b>Thời gian bắt đầu: " + tgBatDau + "</p>" +
   "<p><b>Thời gian kết thúc: " + tgKetThuc + "</p>" +
   "<p><b>Trạng Thái: " + CurrentRow[12] + "</p>" +
   "<p><a href='" + linkOk + "'>Đồng ý </p>" +
   "<p><a href='" + linkNOk + "'>Từ chối </p><br><br>";

  var setRow = parseInt(i) + StartRow;
  ActiveSheet.getRange(setRow, 22).setValue("sent");
 }
 var SendTo = CurrentRow[6];
 if (e.changeType == 'INSERT_ROW' && CurrentRow[12] == '') {
  MailApp.sendEmail({
   to: SendTo,
   cc: "",
   subject: "[Yêu cầu] " + CurrentRow[3] + " của " + CurrentRow[1],
   htmlBody: message,
  });
 }
}

function sendMailToUser(CurrentRow, subject) {
 var tgBatDau = convertDate(CurrentRow[10]);
 var tgKetThuc = convertDate(CurrentRow[11]);
 var message =
  "<p><b>Tiêu để: " + CurrentRow[3] + "</p>" +
  "<p><b>Mục đích: " + CurrentRow[4] + "</p>" +
  "<p><b>Người phê duyệt: " + CurrentRow[5] + "</p>" +
  "<p><b>Loại xin nghỉ: " + CurrentRow[7] + "</p>" +
  "<p><b>Thời gian nghỉ: " + CurrentRow[8] + "</p>" +
  "<p><b>Thông báo cho: " + CurrentRow[9] + "</p>" +
  "<p><b>Thời gian bắt đầu: " + tgBatDau + "</p>" +
  "<p><b>Thời gian kết thúc: " + tgKetThuc + "</p>" +
  "<p><b>Trạng Thái: " + subject + "</p><br><br>";

 MailApp.sendEmail({
  to: CurrentRow[2],
  cc: "",
  subject: "[" + subject + "] " + CurrentRow[3],
  htmlBody: message,
 });

}
function convertDate(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}
function sendMailToHCNS(CurrentRow, subject) {
 var linkNOk = "https://script.google.com/a/devop.com.vn/macros/s/AKfycbx2WpYl_wlne_nBH46KnQawWC55FhDgNH0Ni0fTwd1eJC7IEalO/exec?id=" + CurrentRow[0] + "&ssId=13p5xXxpzAm-led7aSz0cGLDXCjgp49FrnkcuR5xxF1o&status=2";
 var linkApprove = "https://script.google.com/a/devop.com.vn/macros/s/AKfycbx2WpYl_wlne_nBH46KnQawWC55FhDgNH0Ni0fTwd1eJC7IEalO/exec?id=" + CurrentRow[0] + "&ssId=13p5xXxpzAm-led7aSz0cGLDXCjgp49FrnkcuR5xxF1o&status=3";
 var tgBatDau = convertDate(CurrentRow[10]);
 var tgKetThuc = convertDate(CurrentRow[11]);
 var message =
  "<p><b>Tiêu để: " + CurrentRow[3] + "</p>" +
  "<p><b>Mục đích: " + CurrentRow[4] + "</p>" +
  "<p><b>Người phê duyệt: " + CurrentRow[5] + "</p>" +
  "<p><b>Loại xin nghỉ: " + CurrentRow[7] + "</p>" +
  "<p><b>Thời gian nghỉ: " + CurrentRow[8] + "</p>" +
  "<p><b>Thông báo cho: " + CurrentRow[9] + "</p>" +
  "<p><b>Thời gian bắt đầu: " + tgBatDau + "</p>" +
  "<p><b>Thời gian kết thúc: " + tgKetThuc + "</p>" +
  "<p><b>Trạng Thái: " + subject + "</p>" +
  "<p><a href='" + linkNOk + "'>Từ chối</p>" +
  "<p><a href='" + linkApprove + "'>Phê duyệt</p><br><br>";
 MailApp.sendEmail({
  to: "longphu@devop.com.vn",
  cc: "",
  subject: "[Yêu cầu] " + CurrentRow[3],
  htmlBody: message,
 });
}

function doGet(request) {
 Logger.log(request.parameters.id);
 var sheet = SpreadsheetApp.openById(request.parameters.ssId).getActiveSheet();
 var data = sheet.getDataRange().getValues();
 var user = request.parameters.id;
 var status = request.parameters.status;
 var dongy = "Đồng ý";
 var tuchoi = "Từ chối";
 var ketqua = '';
 for (var i = 1; i < data.length; i++) {
  if (data[i][0] == user[0]) {

   if (status == 1) {
    sheet.getRange(i + 1, 13, 1, 1).setValue(dongy);
    ketqua = dongy;
    sendMailToHCNS(data[i], ketqua);
    sendMailToUser(data[i], ketqua);
   }
   if (status == 2) {
    sheet.getRange(i + 1, 13, 1, 1).setValue(tuchoi);
    ketqua = tuchoi;
    sendMailToUser(data[i], ketqua);
   }
   if (status == 3) {
    sheet.getRange(i + 1, 13, 1, 1).setValue("Được phê duyệt");
    ketqua = "phê duyệt yêu cầu";
    sendMailToUser(data[i], "Được phê duyệt");
   }
  }
 }
 var result = "Bạn đã " + ketqua;
 return ContentService.createTextOutput(result);
}
function listAllUsers() {
  var pageToken;
  var page;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Ngày phép");
  var numRows = sheet.getLastRow()-2;
  if(numRows < 1) numRows =1;
  var range = sheet.getRange(3,1,numRows,1);
  var values = range.getValues();
  var creationTime;
  var currentYear;
  var ngayThamNien;
  do {
    page = AdminDirectory.Users.list({
      domain: 'devop.com.vn',
      orderBy: 'givenName',
      pageToken: pageToken
    });
    var users = page.users;
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var checkExists = true;
        values.forEach(id => {
               if(id==user.id){
            checkExists = false;
        }
        })
        if(checkExists){
          creationTime = convertDate(user.creationTime);
          currentYear = new Date().getFullYear();
          ngayThamNien = parseInt((currentYear-new Date(creationTime).getFullYear())/4)
          sheet.appendRow([user.id, user.name.fullName, user.primaryEmail, creationTime,(12+ngayThamNien)]);}
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken); 
}
function computeNgayphep() {
}