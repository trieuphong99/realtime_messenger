$(document).ready(function () {
  $("#link-read-more-all-chat").bind("click", function () {
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;

    $("#link-read-more-all-chat").css("display", "none");
    $(".read-more-all-chat-loader").css("display", "inline-block");

    $.get(
      `/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`,
      function (data) {
        if (data.leftSideData.trim() === "") {
          alertify.notify("You no longer have any contacts", "error", 7);

          $("#link-read-more-all-chat").css("display", "inline-block");
          $(".read-more-all-chat-loader").css("display", "none");
          return false;
        }

        // step 01: handle leftSide
        $("#all-chat").find("ul").append(data.leftSideData);

        // step 02: handle left scroll
        nineScrollLeft();

        // step 03: handle rightSide
        $("#chat-screen").append(data.rightSideData);

        // step 04: call function changeScreenChat
        changeChatScreen();

        // step 05: convert Emoji
        convertEmoji();

        // step 06: handle image modal
        $("body").append(data.imageModalData);

        // step 07: call function gridPhotos
        gridPhotos(5);

        // step 08: handle attachment modal
        $("body").append(data.attachmentModal);

        // step 09: check online
        socket.emit("check-status");

        $("#link-read-more-all-chat").css("display", "inline-block");
        $(".read-more-all-chat-loader").css("display", "none");
      }
    );
  });
});
