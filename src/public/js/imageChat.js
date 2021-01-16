function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
}
function imageChat(divId) {
  $(`#image-chat-${divId}`)
    .unbind("change")
    .on("change", function () {
      let fileData = $(this).prop("files")[0]; // "this" is the reference of #image-chat-${divId}
      let math = ["image/png", "image/jpg", "image/jpeg"];
      let limit = 1048576; // = 1MB

      if ($.inArray(fileData.type, math) === -1) {
        // fileData's data is not matched with any math elements
        alertify.notify(
          "File type is not valid, only jpeg, jpg or png allowed",
          "error",
          7
        );
        $(this).val(null);
        return false;
      }

      if (fileData.size > limit) {
        alertify.notify("File size must be less than 1MB", "error", 7);
        $(this).val(null);
        return false;
      }

      let targetId = $(this).data("chat");
      let isChatGroup = false;

      let messageFormData = new FormData();
      messageFormData.append("my-image-chat", fileData);
      messageFormData.append("uid", targetId);

      if ($(this).hasClass("chat-in-group")) {
        messageFormData.append("isChatGroup", true);
        isChatGroup = true;
      }

      $.ajax({
        url: "/message/add-new-image",
        type: "post",
        cache: false,
        contentType: false,
        processData: false,
        data: messageFormData,
        success: function (data) {
          let dataToEmit = {
            message: data.message,
          };
          // handle message data
          let message = $(
            `<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`
          );
          let imageChat = `<img src="data:${
            data.message.file.contentType
          }; base64, ${bufferToBase64(data.message.file.data.data)}" 
        class="show-image-chat">`;

          if (isChatGroup) {
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}"
        class="avatar-small" title="${data.message.sender.name}"/>`;

            message.html(`${senderAvatar} ${imageChat}`);
            increaseNumberMessageGroup(divId);

            dataToEmit.groupId = targetId;
          } else {
            message.html(imageChat);
            dataToEmit.contactId = targetId;
          }

          // append message data to screen
          $(`.right .chat[data-chat=${divId}]`).append(message);
          nineScrollRight(divId);

          // change message preview and time at leftSide
          $(`.person[data-chat=${divId}]`)
            .find("span.time")
            .removeClass("message-realtime")
            .html(
              moment(data.message.createdAt)
                .locale("vi")
                .startOf("seconds")
                .fromNow()
            );
          $(`.person[data-chat=${divId}]`)
            .find("span.preview")
            .html("Hình ảnh...");

          // move conversation to the top
          $(`.person[data-chat=${divId}]`).on(
            "move.moveConversationToTop",
            function () {
              // moveConversationToTop is the namespace
              let movedData = $(this).parent();
              $(this).closest("ul").prepend(movedData);
              $(this).off("move.moveConversationToTop");
            }
          );
          $(`.person[data-chat=${divId}]`).trigger(
            "move.moveConversationToTop"
          ); // execute code above

          // Emit real-time event
          socket.emit("chat-image", dataToEmit);

          // Add to modal images
          let imageChatToAddModal = `<img src="data:${
            data.message.file.contentType
          }; base64, ${bufferToBase64(data.message.file.data.data)}" />`;
          $(`#imagesModal_${divId}`)
            .find("div.all-images")
            .append(imageChatToAddModal);
        },
        error: function (error) {
          alertify.notify(error.responseText, "error", 7);
        },
      });
    });
}

$(document).ready(function () {
  socket.on("chat-image-response", function (response) {
    let divId = "";

    // handle message data
    let message = $(
      `<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`
    );
    let imageChat = `<img src="data:${
      response.message.file.contentType
    }; base64, ${bufferToBase64(response.message.file.data.data)}" 
  class="show-image-chat">`;

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}"
  class="avatar-small" title="${response.message.sender.name}"/>`;

      message.html(`${senderAvatar} ${imageChat}`);

      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId); 
      }
    } else {
      message.html(imageChat);
      divId = response.currentUserId;
    }

    // append message data to screen
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat=${divId}]`).append(message);
      nineScrollRight(divId);
      increaseNumberMessageGroup(divId);
      $(`.person[data-chat=${divId}]`)
        .find("span.time")
        .addClass("message-realtime");
    }

    // change data preview and time in leftSide
    $(`.person[data-chat=${divId}]`)
      .find("span.time")
      .html(
        moment(response.message.createdAt)
          .locale("vi")
          .startOf("seconds")
          .fromNow()
      );
    $(`.person[data-chat=${divId}]`)
      .find("span.preview")
      .html("Hình ảnh...");

    // move conversation to the top
    $(`.person[data-chat=${divId}]`).on(
      "move.moveConversationToTop",
      function () {
        // moveConversationToTop is the namespace
        let movedData = $(this).parent();
        $(this).closest("ul").prepend(movedData);
        $(this).off("move.moveConversationToTop");
      }
    );
    $(`.person[data-chat=${divId}]`).trigger("move.moveConversationToTop"); // execute code above

    // Add to modal images
    if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let imageChatToAddModal = `<img src="data:${
        response.message.file.contentType
      }; base64, ${bufferToBase64(response.message.file.data.data)}" />`;
      $(`#imagesModal_${divId}`)
        .find("div.all-images")
        .append(imageChatToAddModal);
    }
  });
});
