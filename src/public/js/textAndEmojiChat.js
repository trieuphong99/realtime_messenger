function textAndEmojiChat(divId){
  $(".emojionearea").unbind("keyup").on("keyup", function(element) {
    let currentEmojioneArea = $(this);

    if(element.which === 13) {
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();

      
    
      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVal
      };

      if($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataTextEmojiForSend.isChatGroup = true; // initialize isChatGroup attribute
      }

      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data){
        let message = $(`<div class="bubble me data-mess-id="${data.message._id}"></div>`);
        if(dataTextEmojiForSend.isChatGroup) {
          message.html(`<img src="/images/users/${data.message.sender.avatar}"
            class="avatar-small" title="${data.message.sender.name}">`);

          message.text(data.message.text);
          increaseNumberMessageGroup(divId);
        } else {
          message.text(data.message.text);
        }

        let convertEmojiMessage = emojione.toImage(message.html());
        message.html(convertEmojiMessage);

        $(`.right .chat[data-chat=${divId}]`).append(message);
        nineScrollRight(divId);

        // remove all data at input field
        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        // change message preview and time at leftSide
        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale
        ("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

        // move conversation to the top
        $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function() {
          let movedData = $(this).parent();
          $(this).closest("ul").prepend(movedData);
          $(this).off("click.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).click();

      }).fail(function(response){
        // responseText is initialized in response, console.log(response) to check it out.
        // alertify.notify(response.responseText, "error", 7);
        console.log(response);
      });
    }
  });
}