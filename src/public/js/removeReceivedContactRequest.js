function removeReceivedContactRequest() {
  $(".user-remove-request-contact-received").unbind("click").on("click", function() { // unbind all click events and send only one request each click
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-received-contact-request",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        if(data.success) { // 'data' achieved from contactController's data response

          //$(".noti_content").find(`div[data_uid = ${targetId}]`).remove(); // popup notification
          //$("ul.list-notifications").find(`li>div[data_uid = ${targetId}]`).parent().remove(); // modal notification
        
          //decreaseNumberOfNotification("noti_counter", 1);

          decreaseNumberOfNotification("noti_contact_counter", 1);
          decreaseNumberOfNotifContact("count-request-contact-received");

          // delete request in Yeu cau ket ban page
          $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove();

          socket.emit("remove-received-contact-request", {contactId: targetId});
        }
      }
    });
  })
}

socket.on("remove-received-contact-request-response", function(user) {
  $("#find-user").find(`div.user-remove-request-contact[data-uid = ${user.id}]`).hide();
  $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");

  // delete request in Dang cho xac nhan page
  $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();
  
  decreaseNumberOfNotifContact("count-request-contact-sent");
  decreaseNumberOfNotification("noti_contact_counter", 1);
});

// initialize remove button at the first time when you refresh page (F5) 
$(document).ready(function() {
  removeReceivedContactRequest();
});