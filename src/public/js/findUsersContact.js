function callFindUsers(element) {
  if(element.which === 13 || element.type === "click") {
    let keyword = $("#input-find-users-contact").val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    
    if(!keyword.length) {
      alertify.notify("You have not entered anything yet", "error", 7);
      return false;
    }

    if(!regexKeyword.test(keyword)) {
      alertify.notify("You've entered wrong format of keyword, only accept number, syllable and space", "error", 7);
      return false;
    }

    $.get(`/contact/find-users/${keyword}`, function(data) {
      $("#find-user ul").html(data);
      addContact(); // js/addContact
    });
  }
}

$(document).ready(function() {
  $("#input-find-users-contact").bind("keypress", callFindUsers);
  $("#btn-find-users-contact").bind("click", callFindUsers);
});