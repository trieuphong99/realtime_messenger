function textAndEmojiChat(divId) {
  $(".emojionearea")
    .unbind("keyup")
    .on("keyup", function (element) {
      let currentEmojioneArea = $(this);

      if (element.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data("chat");
        let messageVal = $(`#write-chat-${divId}`).val();

        let dataTextEmojiForSend = {
          uid: targetId,
          messageVal: messageVal,
        };

        if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
          dataTextEmojiForSend.isChatGroup = true; // initialize isChatGroup attribute
        }

        $.post(
          "/message/add-new-text-emoji",
          dataTextEmojiForSend,
          function (data) {
            let dataToEmit = {
              message: data.message,
            };

            // handle message data
            let message = $(
              `<div class="bubble me data-mess-id="${data.message._id}"></div>`
            );
            message.text(data.message.text);
            let convertEmojiMessage = emojione.toImage(message.html());

            if (dataTextEmojiForSend.isChatGroup) {
              let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}"
            class="avatar-small" title="${data.message.sender.name}"/>`;

              message.html(`${senderAvatar} ${convertEmojiMessage}`);
              increaseNumberMessageGroup(divId);

              dataToEmit.groupId = targetId;
            } else {
              message.html(convertEmojiMessage);
              dataToEmit.contactId = targetId;
            }

            // append message data to screen
            $(`.right .chat[data-chat=${divId}]`).append(message);
            nineScrollRight(divId);

            // remove all data at input field
            $(`#write-chat-${divId}`).val("");
            currentEmojioneArea.find(".emojionearea-editor").text("");

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
              .html(emojione.toImage(data.message.text));

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
            socket.emit("chat-text-emoji", dataToEmit);

            // emit remove typing display in real-time
            typingOff(divId);

            // if this div is typing, remove immediately
            let checkTyping = $(`.chat[data-chat=${response.currentGroupId}]`).find(
              "div.bubble-typing-gif"
            );
            if (checkTyping.length) {
              checkTyping.remove();
            }
          }
        ).fail(function (response) {
          // responseText is initialized in response, console.log(response) to check it out.
          // alertify.notify(response.responseText, "error", 7);
          console.log(response);
        });
      }
    });
}

$(document).ready(function () {
  // display messages from others

  let divId = "";

  // handle message data
  socket.on("chat-text-emoji-response", function (response) {
    let message = $(
      `<div class="bubble you data-mess-id="${response.message._id}"></div>`
    );
    message.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(message.html());

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}"
            class="avatar-small" title="${response.message.sender.name}"/>`;

      message.html(`${senderAvatar} ${convertEmojiMessage}`);

      divId = response.currentGroupId;
    } else {
      message.html(convertEmojiMessage);
      divId = response.currentUserId;
    }

    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      // append message data to screen
      $(`.right .chat[data-chat=${divId}]`).append(message);
      nineScrollRight(divId);
      increaseNumberMessageGroup(divId);
      $(`.person[data-chat=${divId}]`)
        .find("span.time")
        .addClass("message-realtime");
    }

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
      .html(emojione.toImage(response.message.text));

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
  });
});
