function deleteContact() {
  $(".user-remove-contact").unbind("click").on("click", function() { // unbind all click events and send only one request each click
    let targetId = $(this).data("uid");
    
    Swal.fire({
      title: 'Do you really wanna delete this contact?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#2ECC71',
      cancelButtonColor: '#ff7675',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if(!result.value) {
        return false;
      }
      $.ajax({
        url: "/contact/delete-contact",
        type: "delete",
        data: {uid: targetId},
        success: function(data) {
          if(data.success) { // data.success is originated from json response file from controller executing the url above
            $("#contacts").find(`ul li[data-uid=${targetId}]`).remove();
  
            // caculateNotifContact.js
            decreaseNumberOfNotifContact("count-contacts");
  
            socket.emit("delete-contact", {contactId: targetId});
          }
        }
      });
    });
    
  });
}

// user gets events from others
socket.on("delete-contact-response", function(user) {
  $("#contacts").find(`ul li[data-uid=${targetId}]`).remove();

  // caculateNotifContact.js
  decreaseNumberOfNotifContact("count-contacts");
});

// initialize delete button at the first time when you refresh page (F5) 
$(document).ready(function() {
  deleteContact();
});