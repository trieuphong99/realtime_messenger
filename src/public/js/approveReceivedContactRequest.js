function approveReceivedContactRequest() {
  $(".user-approve-request-contact-received").unbind("click").on("click", function() { // unbind all click events and send only one request each click
    let targetId = $(this).data("uid");
    
    $.ajax({
      url: "/contact/approve-received-contact-request",
      type: "put",
      data: {uid: targetId},
      success: function(data) {
        if(data.success) {
          let userInfo = $("#request-contact-received").find(`ul li[data-uid=${targetId}]`);
          $(userInfo).find("div.user-approve-request-contact-received").remove();
          $(userInfo).find("div.user-remove-request-contact-received").remove();
          $(userInfo).find("div.contactPanel")
            .append(`<div class="user-talk" data-uid="<%= user._id %>">
                        Trò chuyện
                    </div>
                    <div class="user-remove-contact action-danger" data-uid="<%= user._id %>">
                        Xóa liên hệ
                    </div>`);

          let userInfoHtml = userInfo.get(0).outerHTML; // get html of userInfo
          $("#contacts").find("ul").prepend(userInfoHtml);
          $(userInfo).remove();

          // caculateNotifContact.js
          decreaseNumberOfNotifContact("count-request-contact-received"); 
          increaseNumberOfNotifContact("count-contacts");

          // caculateNotification.js
          decreaseNumberOfNotification("noti_contact_counter", 1);

          deleteContact(); // add delete contact button
          socket.emit("approve-received-contact-request", {contactId: targetId});
        }
      }
    });
  })
}

// user gets events from others
socket.on("approve-received-contact-request-response", function(user) {
  let notif = `<div class="notif-read-false" data-uid="${user.id}">
              <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
              <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
              </div>`;
  $(".noti_content").prepend(notif);  // prepend: adding from top to bottom // popoup notification
  $("ul.list-notifications").prepend(`<li>${notif}</li>`); // modal notification

  decreaseNumberOfNotification("noti_contact_counter", 1);
  increaseNumberOfNotification("noti_counter", 1);

  decreaseNumberOfNotifContact("count-request-contact-sent");
  increaseNumberOfNotifContact("count-contacts");

  // remove pending contact request from user to others
  $("#request-contact-sent").find(`ul li[data-uid=${user.id}]`).remove();
  $("#find-user").find(`ul li[data-uid=${user.id}]`).remove();

  let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="images/users/${user.avatar}" alt="">
                            </div>
                            <div class="user-name">
                                <p>
                                    ${user.username}
                                </p>
                            </div>
                            <br>
                            <div class="user-address">
                                <span>&nbsp ${user.address}</span>
                            </div>
                            <div class="user-talk" data-uid="${user.id}">
                                Trò chuyện
                            </div>
                            <div class="user-remove-contact action-danger" data-uid="${user.id}">
                                Xóa liên hệ
                            </div>
                        </div>
                    </li>`;
  $("#contacts").find("ul").prepend(userInfoHtml);
  deleteContact(); // add delete contact button
});

// initialize approve button at the first time when you refresh page (F5) 
$(document).ready(function() {
  approveReceivedContactRequest();
});