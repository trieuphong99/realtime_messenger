function removeContactRequest() {
  $(".user-remove-request-contact").unbind("click").on("click", function() { // unbind all click events and send only one request each click
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-contact-request",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        if(data.success) { // 'data' achieved from contactController's data response
          $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");

          decreaseNumberOfNotification("noti_contact_counter", 1);
          decreaseNumberOfNotifContact("count-request-contact-sent");

          // delete request in Dang cho xac nhan page
          $("#request-contact-sent").find(`li[data-uid=${targetId}]`).remove();
          socket.emit("remove-contact-request", {contactId: targetId});
        }
      }
    });
  })
}

socket.on("remove-contact-request-response", function(user) {
  $(".noti_content").find(`div[data_uid = ${user.id}]`).remove(); // popup notification
  $("ul.list-notifications").find(`li>div[data_uid = ${user.id}]`).parent().remove(); // modal notification
  
  // delete request in Yeu cau ket ban page
  $("#request-contact-received").find(`li[data-uid=${user.id}]`).remove();
  
  decreaseNumberOfNotifContact("count-request-contact-received");
  decreaseNumberOfNotification("noti_contact_counter", 1);
  decreaseNumberOfNotification("noti_counter", 1);
});

// initialize remove button at the first time when you refresh page (F5) 
$(document).ready(function() {
  removeContactRequest();
});