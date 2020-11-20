$(document).ready(function(){
  $("#link-read-more-contacts-received").bind("click", function(){
    let skipNumber = $("#request-contact-received").find("li").length;

    $("#link-read-more-contacts-received").css("display", "none");
    $(".read-more-contacts-loader").css("display", "inline-block");

    $.get(`/contact/read-more-received-contacts?skipNumber=${skipNumber}`, function(contacts) {
      if (!contacts.length) {
        alertify.notify("You no longer have any received contacts", "error", 7);

        $("#link-read-more-contacts-received").css("display", "inline-block");
        $(".read-more-contacts-loader").css("display", "none");
        return false;
      }
      contacts.forEach(function(user) {
        $("#request-contact-received")
          .find("ul")
          .append(`
                <li class="_contactList" data-uid="${user._id}">
                  <div class="contactPanel">
                      <div class="user-avatar">
                          <img src="images/users/${user.avatar}" alt="">
                      </div>
                      <div class="user-name">
                          <p>
                              ${user.avatar}
                          </p>
                      </div>
                      <br>
                      <div class="user-address">
                          <span>&nbsp ${user.address}</span>
                      </div>
                      <div class="user-acccept-contact-received" data-uid="${user._id}">
                          Chấp nhận
                      </div>
                      <div class="user-reject-request-contact-received action-danger" data-uid="${user._id}">
                          Xóa yêu cầu
                      </div>
                  </div>
                </li>`);
      });

      $("#link-read-more-contacts-received").css("display", "inline-block");
      $(".read-more-contacts-loader").css("display", "none");
    });
  });
});