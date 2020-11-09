function increaseNumberOfNotification (className) {
  let currentValue = +$(`.${className}`).text();
  currentValue += 1;

  if(currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(`(${currentValue})`);
  }
}

function decreaseNumberOfNotification (className) {
  let currentValue = +$(`.${className}`).text();
  currentValue -= 1;

  if(currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(`(${currentValue})`);
  }
}
