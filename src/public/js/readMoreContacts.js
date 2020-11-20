$(document).ready(function(){
  $("#link-read-more-contacts").bind("click", function(){
    let skipNumber = $("#contacts").find("li").length;

    $("#link-read-more-contacts").css("display", "none");
    $(".read-more-contacts-loader").css("display", "inline-block");

    $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function(contacts) {
      if (!contacts.length) {
        alertify.notify("You no longer have any contacts", "error", 7);

        $("#link-read-more-contacts").css("display", "inline-block");
        $(".read-more-contacts-loader").css("display", "none");
        return false;
      }
      contacts.forEach(function(user) {
        $("#contacts")
          .find("ul")
          .append(`<li class="_contactList" data-uid="${user._id}">
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
                            <span>&nbsp ${(user.address !== null) ? user.address : ""}</span>
                        </div>
                        <div class="user-talk" data-uid="${user._id}">
                            Trò chuyện
                        </div>
                        <div class="user-remove-contact action-danger" data-uid="${user._id}">
                            Xóa liên hệ
                        </div>
                    </div>
                </li>`);
      });

      $("#link-read-more-contacts").css("display", "inline-block");
      $(".read-more-contacts-loader").css("display", "none");
    });
  });
});