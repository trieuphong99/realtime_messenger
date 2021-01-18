function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`)
    .unbind("change")
    .on("change", function () {
      let fileData = $(this).prop("files")[0]; // "this" is the reference of #image-chat-${divId}
      let limit = 1048576; // = 1MB

      if (fileData.size > limit) {
        alertify.notify("File size must be less than 1MB", "error", 7);
        $(this).val(null);
        return false;
      }

      let targetId = $(this).data("chat");
      let isChatGroup = false;

      let messageFormData = new FormData();
      messageFormData.append("my-attachment-chat", fileData);
      messageFormData.append("uid", targetId);

      if ($(this).hasClass("chat-in-group")) {
        messageFormData.append("isChatGroup", true);
        isChatGroup = true;
      }

      $.ajax({
        url: "/message/add-new-attachment",
        type: "post",
        cache: false,
        contentType: false,
        processData: false,
        data: messageFormData,
        success: function (data) {
          console.log(data);
          let dataToEmit = {
            message: data.message,
          };

          // handle message data
          let message = $(
            `<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`
          );

          let attachmentChat = `<a href="data:${
            data.message.file.contentType
          }; base64, ${bufferToBase64(data.message.file.data.data)}" 
          download="${data.message.file.fileName}">
            ${data.message.file.fileName}
          </a>`;

          if (isChatGroup) {
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}"
        class="avatar-small" title="${data.message.sender.name}"/>`;

            message.html(`${senderAvatar} ${attachmentChat}`);
            increaseNumberMessageGroup(divId);

            dataToEmit.groupId = targetId;
          } else {
            message.html(attachmentChat);
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
            .html("New file...");

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
          socket.emit("chat-attachment", dataToEmit);

          // Add to modal attachments
          let attachmentChatToAddModal = `
          <li>
            <a href="data:${
              data.message.file.contentType
            }; base64, ${bufferToBase64(data.message.file.data.data)}" 
            download="${data.message.file.fileName}">
            ${data.message.file.fileName}
            </a>
          </li>`;
          $(`#attachmentsModal_${divId}`)
            .find("ul.list-attachments")
            .append(attachmentChatToAddModal);
        },
        error: function (error) {
          alertify.notify(error.responseText, "error", 7);
        },
      });
    });
}

$(document).ready(function () {
  socket.on("chat-attachment-response", function (response) {
    let divId = "";

    // handle message data
    let message = $(
      `<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`
    );
    let attachmentChat = `<a href="data:${
      response.message.file.contentType
    }; base64, ${bufferToBase64(response.message.file.data.data)}" 
    download="${response.message.file.fileName}">
      ${response.message.file.fileName}
    </a>`;

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}"
  class="avatar-small" title="${response.message.sender.name}"/>`;

      message.html(`${senderAvatar} ${attachmentChat}`);

      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      message.html(attachmentChat);
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
    $(`.person[data-chat=${divId}]`).find("span.preview").html("New file...");

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
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let attachmentChatToAddModal = `
          <li>
            <a href="data:${
              response.message.file.contentType
            }; base64, ${bufferToBase64(response.message.file.data.data)}" 
            download="${response.message.file.fileName}">
            ${response.message.file.fileName}
            </a>
          </li>`;
      $(`#attachmentsModal_${divId}`)
        .find("ul.list-attachments")
        .append(attachmentChatToAddModal);
    }
  });
});
