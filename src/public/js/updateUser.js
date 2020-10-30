let userAvatar = null;
let userInfo = {};
let originAvatar = null;
let originUserInfo = null;

function updateUserInfo() {
  $("#input-change-avatar").bind("change", function(){
    let fileData = $(this).prop("files")[0]; // "this" is the reference of #input-change-avatar
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // = 1MB

    if ($.inArray(fileData.type, math) === -1) { // fileData's data is not matched with any math elements
      alertify.notify("File type is not valid, only jpeg, jpg or png allowed", "error", 7);
      $(this).val(null);
      return false;
    }

    if (fileData.size > limit) {
      alertify.notify("File size must be less than 1MB", "error", 7);
      $(this).val(null);
      return false;
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
      };
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
    let username = $(this).val();
    let regexUsername = new RegExp("/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/");
    
    if(!regexUsername.test(username) || username.length < 3 || username.length > 17) {
      alertify.notify("The username only limits to 3-17 characters and not includes special ones" ,"error", 7);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }

    userInfo.username = username;
  });

  $("#input-change-gender-male").bind("click", function(){
    let gender = $(this).val();

    if(gender !== "male") {
      alertify.notify("What kinda your gender?", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = gender;
  });

  $("#input-change-gender-female").bind("click", function(){
    let gender = $(this).val();
    if(gender !== "female") {
      alertify.notify("What kinda your gender?", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = gender;
  });

  $("#input-change-address").bind("change", function(){
    let address = $(this).val();

    if(address.length < 10 || address.length > 100) {
      alertify.notify("The address only limits to 10-100 characters", "error", 7);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }

    userInfo.address = address;
  });

  $("#input-change-phone").bind("change", function(){
    let phone = $(this).val();
    let regexPhone = new RegExp("^(0)[0-9]{9,10}$");

    if(!regexPhone.test(phone)) {
      alertify.notify("The phone number is not valid in your country", "error", 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }
    userInfo.phone = phone;
  })

}

$(document).ready(function(){
  originAvatar = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    phone: $("#input-change-phone").val(),
    address: $("#input-change-address").val(), 
  };

  updateUserInfo();

  function callUpdateUserAvatar() {
    $.ajax({
      url: "/user/update-avatar",
      type: "put",
      cache: false,
      contentType: false,
      processData: false,
      data: userAvatar,
      success: function(result) {
        // display successfully
        console.log(result);
        $(".user-modal-alert-success").find("span").text(result.message);
        $(".user-modal-alert-success").css("display", "block");

        // update avatar at navbar
        $("#navbar-avatar").attr("src", result.imageSrc);
        
        // update origin avatar src
        originAvatar = result.imageSrc;

        //reset all
        $("#input-btn-cancel-update-user").click();
      },
      error: function(error) {
        // display errors
        console.log(error);
        $(".user-modal-alert-error").find("span").text(error.responseText);
        $(".user-modal-alert-error").css("display", "block");

        // reset all
        $("#input-btn-cancel-update-user").click();
      }
    });
  }

  function callUpdateUserInfo() {
    $.ajax({
      url: "/user/update-info",
      type: "put",
      data: userInfo,
      success: function(result) {
        // display successfully
        console.log(result);
        $(".user-modal-alert-success").find("span").text(result.message);
        $(".user-modal-alert-success").css("display", "block");
        
        // update origin info
        originUserInfo = Object.assign(originUserInfo, userInfo);

        // update username at navbar
        $("#navbar-username").text(originUserInfo.username);

        //reset all
        $("#input-btn-cancel-update-user").click();
      },
      error: function(error) {
        // display errors
        console.log(error);
        $(".user-modal-alert-error").find("span").text(error.responseText);
        $(".user-modal-alert-error").css("display", "block");

        // reset all
        $("#input-btn-cancel-update-user").click();
      }
    });
  }
  $("#input-btn-update-user").bind("click", function() {
    console.log(userAvatar);
    if($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("You must change your information before contiue.", "error", 7);
      return false;
    }
    if(userAvatar) {
      callUpdateUserAvatar();
    }
    if(!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
  });

  $("#input-btn-cancel-update-user").bind("click", function() {
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvatar);

    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
    $("#input-change-phone").val(originUserInfo.phone);
    $("#input-change-address").val(originUserInfo.address);
  });
})