let userAvatar = null;
let userInfo = {};
let originAvatar = null;

function updateUserInfo() {
  $("#input-change-avatar").bind("change", function(){
    let fileData = $(this).prop("files")[0]; // "this" is the reference of #input-change-avatar
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // = 1MB

    if ($.inArray(fileData.type, math) === -1) { // fileData's data is not matched with any math elements
      alertify.notify("File type is not valid, only jpeg, jpg or png allowed", "error", 7);
      $(this).val(null);
      return false
    }

    if (fileData.size > limit) {
      alertify.notify("File size must be less than 1MB", "error", 7);
      $(this).val(null);
      return false
    }

    if (typeof (FileReader) != "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      let fileReader = new FileReader();
      fileReader.onload = function(element) {
        $("<img>", {
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview);
      }
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append("avatar", fileData);

      userAvatar = formData;

    } else {
      alertify.notify("Your browser version does not support FileReader", "error", 7);
    }
  });

  $("#input-change-username").bind("change", function(){
    userInfo.username = $(this).val();
  });

  $("#input-change-gender-male").bind("click", function(){
    userInfo.gender = $(this).val();
  });

  $("#input-change-gender-female").bind("click", function(){
    userInfo.gender = $(this).val();
  });

  $("#input-change-address").bind("change", function(){
    userInfo.address = $(this).val();
  });

  $("#input-change-phone").bind("change", function(){
    userInfo.phone = $(this).val();
  })

}

$(document).ready(function(){
  updateUserInfo();

  originAvatar = $("#user-modal-avatar").attr("src");
  $("#input-btn-update-user").bind("click", function() {
    console.log(userAvatar);
    console.log(userInfo);
  });

  $("#input-btn-cancel-update-user").bind("click", function() {
    userAvatar = null;
    userInfo = {};
    $("#user-modal-avatar").attr("src", originAvatar);
  });
})