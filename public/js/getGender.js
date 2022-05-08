(function ($) {
  $(document).ready(function () {
    var nameselect = $("#genderVal").val();
    var all_select = $("#inputGender > option");

    for (let i = 0; i < all_select.length; i++) {
      var svalue = all_select[i].text;
      if (nameselect == svalue) {
        $("#inputGender option[value='" + svalue + "']").attr(
          "selected",
          "selected"
        );
      }
    }
  });
})(jQuery);
