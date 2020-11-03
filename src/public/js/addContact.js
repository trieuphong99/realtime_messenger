function addContact() {
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid");
    $.post("/contact/add-new", {uid: targetId}, function(data) {
      console.log(data);
    })
  })
}