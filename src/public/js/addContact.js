function addContact() {
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid");
    $.post("/contact/add-new", {uid: targetId}, function(data) {
      if(data.success) { // 'data' achieved from contactController's data response
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display", "inline-block");
        increaseNumberOfNotifContact("count-request-contact-sent");
        socket.emit("add-new-contact", {contactId: targetId});
      }
    })
  })
}

socket.on("add-new-contact-response", function(user) {
  let notif = `<span data-uid="${user.id}">
              <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
              <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
              </span><br><br><br>`;
  $(".noti_content").prepend(notif);  // prepend: adding from top to bottom
  increaseNumberOfNotifContact("count-request-contact-received");
  increaseNumberOfNotification("noti_contact_counter");
  increaseNumberOfNotification("noti_counter");
});