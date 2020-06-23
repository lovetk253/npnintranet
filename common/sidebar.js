$(function () {

  $(".sidebar-dropdown > a").click(function () {
    $(".sidebar-submenu").slideUp(200);
    if (
      $(this)
        .parent()
        .hasClass("active")
    ) {
      $(".sidebar-dropdown").removeClass("active");
      $(this)
        .parent()
        .removeClass("active");
    } else {
      $(".sidebar-dropdown").removeClass("active");
      $(this)
        .next(".sidebar-submenu")
        .slideDown(200);
      $(this)
        .parent()
        .addClass("active");
    }
  });

  $("#close-sidebar").click(function () {
    $(".page-wrapper").removeClass("toggled");
  });
  $("#show-sidebar").click(function () {
    $(".page-wrapper").addClass("toggled");
  });
  loadDataUser();

});
function loadDataUser() {
  var data = JSON.parse(localStorage.getItem('storageUserData'));
  if (data !== null) {
    var fullName = data["name"]["fullName"];
    var primaryEmail = data["primaryEmail"];
    var imageUrl = data["imageUrl"];
    $('#fullName').html(fullName);
    $('#primaryEmail').html(primaryEmail);
    $("#imageUrl").attr("src", imageUrl);
  }
}
function gotoOrgUnit() {
  window.location.replace("orgunits.html");

}