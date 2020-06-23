function composeToManager(e) {
    if (e.changeType == 'INSERT_ROW') {
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
        if (CurrentRow[12] == '') {
            MailApp.sendEmail({
                to: SendTo,
                cc: "",
                subject: "[Yêu cầu] " + CurrentRow[3] + " của " + CurrentRow[1],
                htmlBody: message,
            });
        }
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
                getNgayphep();
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
    var numRows = sheet.getLastRow() - 2;
    if (numRows < 1) numRows = 1;
    var range = sheet.getRange(3, 1, numRows, 1);
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
                    if (id == user.id) {
                        checkExists = false;
                    }
                })
                if (checkExists) {
                    creationTime = convertDate(user.creationTime);
                    currentYear = new Date().getFullYear();
                    ngayThamNien = parseInt((currentYear - new Date(creationTime).getFullYear()) / 4)
                    sheet.appendRow([user.id, user.name.fullName, user.primaryEmail, creationTime, (12 + ngayThamNien)]);
                }
            }
        } else {
            Logger.log('No users found.');
        }
        pageToken = page.nextPageToken;
    } while (pageToken);
}

function getNgayphep() {
    var ChiTietSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Chi tiết");
    var StartRow = 2;
    var RowRange = ChiTietSheet.getLastRow() - StartRow + 1;
    var WholeRange = ChiTietSheet.getRange(StartRow, 1, RowRange, 23);
    var AllValues = WholeRange.getValues();
    for (k in AllValues) {
        var CurrentRow = AllValues[k];
        var UpdateStatus = CurrentRow[22];
        if (CurrentRow[12] !== "Được phê duyệt" && CurrentRow[22] == "Updated") {
            reverseNgayPhep(CurrentRow);
            var setRow = parseInt(k) + StartRow;
            ChiTietSheet.getRange(setRow, 23).setValue("");
//            Logger.log('di qua day.');
        }
        if (UpdateStatus == "Updated")
            continue;
        if (CurrentRow[12] == "Được phê duyệt" && CurrentRow[22] == "") {
            setNgayPhep(CurrentRow);
            var setRow = parseInt(k) + StartRow;
            ChiTietSheet.getRange(setRow, 23).setValue("Updated");
        }


    }
}

function setNgayPhep(row) {
    var ActiveSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ngày phép");
    var StartRow = 3;
    var RowRange = ActiveSheet.getLastRow() - StartRow + 1;
    var WholeRange = ActiveSheet.getRange(StartRow, 1, RowRange, 31);
    var AllValues = WholeRange.getValues();
    for (l in AllValues) {
        var CurrentRow = AllValues[l];
        if (row[2] == CurrentRow[2]) {
            var year1 = new Date(row[10]).getFullYear();
            var month1 = new Date(row[10]).getMonth() + 1;
            var date1 = new Date(row[10]).getDate();
            var year2 = new Date(row[11]).getFullYear();
            var month2 = new Date(row[11]).getMonth() + 1;
            var date2 = new Date(row[11]).getDate();
            var d01 = [year1, month1, date1].join("-");
            var d02 = [year2, month2, date2].join("-");
            var thongKeNgayNghi = tinhSoNgayNghi(d01, d02);
            var currentYear = new Date().getFullYear();
            var soNgayNghi = workingDaysBetweenDates(d01, d02);
            var setRow = parseInt(l) + StartRow;
            var thangXinNghi = new Date(row[10]).getMonth() + 1;
         
            if (row[7] == "Nghỉ phép" && (row[8] == "Nghỉ buổi sáng" || row[8] == "Nghỉ buổi chiều")) {
               Logger.log('di qua day nghi buoi sang.' + row[7] + " - " + row[8]);
                fillToTable(thangXinNghi, CurrentRow, 6, setRow, ActiveSheet, 0.5);
            } else if (row[7] == "Nghỉ phép" && row[8] == "Nghỉ cả ngày") {
                fillToTable(thangXinNghi, CurrentRow, 6, setRow, ActiveSheet, 1);
            }
            if (row[7] == "Nghỉ không lương" && (row[8] == "Nghỉ buổi sáng" || row[8] == "Nghỉ buổi chiều")) {
                fillToTable(thangXinNghi, CurrentRow, 7, setRow, ActiveSheet, 0.5);
            } else if (row[7] == "Nghỉ không lương" && row[8] == "Nghỉ cả ngày") {
                fillToTable(thangXinNghi, CurrentRow, 7, setRow, ActiveSheet, 1);
            }
            if (typeof thongKeNgayNghi[currentYear] !== "undefined" && soNgayNghi > 1 && row[8] !== "Nghỉ buổi sáng" && row[8] !== "Nghỉ buổi chiều") {
                thongKeNgayNghi[currentYear].forEach(year => {
                    var thang = parseInt(Object.keys(year));
                    var ngay = parseFloat(Object.values(year));
                    if (row[7] == "Nghỉ phép") {
                        fillToTable(thang, CurrentRow, 6, setRow, ActiveSheet, ngay)
                    }
                    if (row[7] == "Nghỉ không lương") {
                        fillToTable(thang, CurrentRow, 7, setRow, ActiveSheet, ngay)
                    }
                })
            }
        }
    }
}

function reverseNgayPhep(row) {
    var ActiveSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ngày phép");
    var StartRow = 3;
    var RowRange = ActiveSheet.getLastRow() - StartRow + 1;
    var WholeRange = ActiveSheet.getRange(StartRow, 1, RowRange, 31);
    var AllValues = WholeRange.getValues();
    for (l in AllValues) {
        var CurrentRow = AllValues[l];
        if (row[2] == CurrentRow[2]) {
            var year1 = new Date(row[10]).getFullYear();
            var month1 = new Date(row[10]).getMonth() + 1;
            var date1 = new Date(row[10]).getDate();
            var year2 = new Date(row[11]).getFullYear();
            var month2 = new Date(row[11]).getMonth() + 1;
            var date2 = new Date(row[11]).getDate();
            var d01 = [year1, month1, date1].join("-");
            var d02 = [year2, month2, date2].join("-");
            var thongKeNgayNghi = tinhSoNgayNghi(d01, d02);
            var currentYear = new Date().getFullYear();
            var soNgayNghi = workingDaysBetweenDates(d01, d02);
            var setRow = parseInt(l) + StartRow;
            var thangXinNghi = new Date(row[10]).getMonth() + 1;
            if (row[7] == "Nghỉ phép" && (row[8] == "Nghỉ buổi sáng" || row[8] == "Nghỉ buổi chiều")) {
                fillToTable(thangXinNghi, CurrentRow, 6, setRow, ActiveSheet, -0.5);
            } else if (row[7] == "Nghỉ phép" && row[8] == "Nghỉ cả ngày") {
                fillToTable(thangXinNghi, CurrentRow, 6, setRow, ActiveSheet, -1);
            }
            if (row[7] == "Nghỉ không lương" && (row[8] == "Nghỉ buổi sáng" || row[8] == "Nghỉ buổi chiều")) {
                fillToTable(thangXinNghi, CurrentRow, 7, setRow, ActiveSheet, -0.5);
            } else if (row[7] == "Nghỉ không lương" && row[8] == "Nghỉ cả ngày") {
                fillToTable(thangXinNghi, CurrentRow, 7, setRow, ActiveSheet, -1);
            }
            if (typeof thongKeNgayNghi[currentYear] !== "undefined" && soNgayNghi > 1 && row[8] !== "Nghỉ buổi sáng" && row[8] !== "Nghỉ buổi chiều") {
                thongKeNgayNghi[currentYear].forEach(year => {
                    var thang = parseInt(Object.keys(year));
                    var ngay = parseFloat(Object.values(year));
                    if (row[7] == "Nghỉ phép") {
                        fillToTable(thang, CurrentRow, 6, setRow, ActiveSheet, (0 - ngay))
                    }
                    if (row[7] == "Nghỉ không lương") {
                        fillToTable(thang, CurrentRow, 7, setRow, ActiveSheet, (0 - ngay))
                    }
                })
            }
        }
    }
}

function fillToTable(thangXinNghi, CurrentRow, i, setRow, ActiveSheet, soNgay) {
    for (var j = 1; j < 13; j++) {
        if (thangXinNghi == j) {
          if (CurrentRow[i + (j - 1) * 2] == "") ActiveSheet.getRange(setRow, (i + j * 2 - 1)).setValue(soNgay);
            else {
                ActiveSheet.getRange(setRow, (i + j * 2 - 1)).setValue((parseFloat(CurrentRow[i + (j - 1) * 2])) + soNgay);
            }
        }
    }
}


function tinhSoNgayNghi(tgBatDau, tgKetThuc) {
    var ngayBatDau = new Date(tgBatDau).getDate();
    var thangBatDau = ("0" + (new Date(tgBatDau).getMonth() + 1)).slice(-2)
    var namBatDau = new Date(tgBatDau).getFullYear();
    var ngayKetThuc = new Date(tgKetThuc).getDate();
    var thangKetThuc = ("0" + (new Date(tgKetThuc).getMonth() + 1)).slice(-2)
    var namKetThuc = new Date(tgKetThuc).getFullYear();
    var jsonNgayNghi = {};
    var tempThang = thangBatDau;
    var tempThangKetThuc = thangKetThuc;
    var tempNgay = ngayBatDau;
    for (namBatDau; namBatDau <= namKetThuc; namBatDau++) {

        if (namBatDau < namKetThuc) {
            tempThangKetThuc = 12;
        } else if (namBatDau == namKetThuc) {
            tempThangKetThuc = thangKetThuc;
        }
        for (tempThang; tempThang <= tempThangKetThuc; tempThang++) {
            if (tempThang < tempThangKetThuc) {
                var dDate1 = [namBatDau, tempThang, tempNgay].join("-");
                var lastDayOfMonth = new Date(namBatDau, tempThang, 0).getDate();
                var dDate2 = [namBatDau, tempThang, lastDayOfMonth].join("-");
                var soNgay = workingDaysBetweenDates(dDate1, dDate2);
                if (typeof jsonNgayNghi[namBatDau] == 'undefined') {
                    jsonNgayNghi[namBatDau] = [];
                    jsonNgayNghi[namBatDau].push({
                        [tempThang]: soNgay
                    });
                } else {
                    jsonNgayNghi[namBatDau].push({
                        [tempThang]: soNgay
                    });
                }
                tempNgay = 1;
            } else if (tempThang == tempThangKetThuc) {
                if (namBatDau < namKetThuc) {
                    tempNgayKetThuc = 31;
                } else if (namBatDau == namKetThuc) {
                    tempNgayKetThuc = ngayKetThuc;
                }
                var dDate1 = [namBatDau, tempThang, tempNgay].join("-");
                var dDate2 = [namBatDau, tempThang, tempNgayKetThuc].join("-");
                var soNgay = workingDaysBetweenDates(dDate1, dDate2);
                if (typeof jsonNgayNghi[namBatDau] == 'undefined') {
                    jsonNgayNghi[namBatDau] = [];
                    jsonNgayNghi[namBatDau].push({
                        [tempThang]: soNgay
                    });
                } else {
                    jsonNgayNghi[namBatDau].push({
                        [tempThang]: soNgay
                    });
                }
            }
        }
        tempThang = 1;
        tempNgay = 1;
    }
    return jsonNgayNghi;
}

let workingDaysBetweenDates = (d0, d1) => {
    var holidays = ['2016-05-03', '2016-05-05', '2016-05-07'];
    var startDate = parseDate(d0);
    var endDate = parseDate(d1);
    if (endDate < startDate) {
        return 0;
    }
    var millisecondsPerDay = 86400 * 1000;
    startDate.setHours(0, 0, 0, 1);
    endDate.setHours(23, 59, 59, 999);
    var diff = endDate - startDate;
    var days = Math.ceil(diff / millisecondsPerDay);
    var weeks = Math.floor(days / 7);
    days -= weeks * 2;
    var startDay = startDate.getDay();
    var endDay = endDate.getDay();
    if (startDay - endDay > 1) {
        days -= 2;
    }
    if (startDay == 0 && endDay != 6) {
        days--;
    }
    if (endDay == 6 && startDay != 0) {
        days--;
    }
    holidays.forEach(day => {
        if ((day >= d0) && (day <= d1)) {
            if ((parseDate(day).getDay() % 6) != 0) {
                days--;
            }
        }
    });
    return days;
}

function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}