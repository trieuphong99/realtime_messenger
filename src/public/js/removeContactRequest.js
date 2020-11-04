function removeContactRequest() {
  $(".user-remove-request-contact").bind("click", function() {
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-contact-request",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        if(data.success) { // 'data' achieved from contactController's data response
          $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
          decreaseNumberOfNotifContact("count-request-contact-sent");
        }
      }
    });
  })
}