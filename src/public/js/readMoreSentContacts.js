$(document).ready(function(){
  $("#link-read-more-contacts-sent").bind("click", function(){
    let skipNumber = $("#request-contact-sent").find("li").length;

    $("#link-read-more-contacts-sent").css("display", "none");
    $(".read-more-contacts-loader").css("display", "inline-block");

    $.get(`/contact/read-more-sent-contacts?skipNumber=${skipNumber}`, function(contacts) {
      if (!contacts.length) {
        alertify.notify("You no longer have any sent contacts", "error", 7);

        $("#link-read-more-contacts-sent").css("display", "inline-block");
        $(".read-more-contacts-loader").css("display", "none");
        return false;
      }
      contacts.forEach(function(user) {
        $("#request-contact-sent")
          .find("ul")
          .append(`
                  <li class="_contactList" data-uid="${user._id}">
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
                        <div class="user-remove-request-contact action-danger display-important" data-uid="${user._id}">
                            Hủy yêu cầu
                        </div>
                    </div>
                  </li>`);
      });

      // add remove button
      removeContactRequest();

      $("#link-read-more-contacts-sent").css("display", "inline-block");
      $(".read-more-contacts-loader").css("display", "none");
    });
  });
});