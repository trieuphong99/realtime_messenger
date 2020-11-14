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
          socket.emit("remove-contact-request", {contactId: targetId});
        }
      }
    });
  })
}

socket.on("remove-contact-request-response", function(user) {
  $(".noti_content").find(`div[data_uid = ${user.id}]`).remove(); // popup notification
  $("ul.list-notifications").find(`li>div[data_uid = ${user.id}]`).parent().remove(); // modal notification
  
  decreaseNumberOfNotifContact("count-request-contact-received");
  decreaseNumberOfNotification("noti_contact_counter");
  decreaseNumberOfNotification("noti_counter");
});