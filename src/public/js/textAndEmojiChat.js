function textAndEmojiChat(divId){
  $(".emojionearea").unbind("keyup").on("keyup", function(element) {
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
        console.log(data.message);
      }).fail(function(response){
        // responseText is initialized in response, console.log(response) to check it out.
        alertify.notify(response.responseText, "error", 7);
      });
    }
  });
}