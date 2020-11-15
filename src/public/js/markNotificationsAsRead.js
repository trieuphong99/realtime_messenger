function markNotificationsAsRead(targetUsers) {
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: {targetUsers: targetUsers},
    success: function(result) {
      if(result) {
        targetUsers.forEach(function(uid) {
          $(".noti_content").find(`div[data-uid=${uid}]`).removeClass("notif-read-false");
          $("ul.list-notifications").find(`li>div[data-uid=${uid}]`).removeClass("notif-read-false");
        });
        decreaseNumberOfNotification("noti-counter", targetUsers.length);
      }
    }
  })
}

$(document).ready(function() {
  // link at popup notification
  $("#popup-mark-notif-as-read").bind("click", function(){
    let targetUsers = [];
    $(".noti_content").find("div.notif-read-false").each(function(index, notification){
      targetUsers.push($(notification).data("uid"));
    });
    if(!targetUsers.length) {
      alertify.notify("You no longer have any notifs", "error", 7);
      return false;
    }
    markNotificationsAsRead(targetUsers);
  });

  // link at modal notification
  $("#modal-mark-notif-as-read").bind("click", function(){
    let targetUsers = [];
    $("ul.list-notifications").find("li>div.notif-read-false").each(function(index, notification){
      targetUsers.push($(notification).data("uid"));
    });
    if(!targetUsers.length) {
      alertify.notify("You no longer have any notifs", "error", 7);
      return false;
    }
    markNotificationsAsRead(targetUsers);
  });
})