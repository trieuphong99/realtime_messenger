function increaseNumberOfNotifContact (className) {
  let currentValue = +$(`.${className}`).find("b").text();
  currentValue += 1;

  if(currentValue === 0) {
    $(`.${className}`).html("");
  } else {
    $(`.${className}`).html(`(<b>${currentValue}</b>)`);
  }
}

function decreaseNumberOfNotifContact (className) {
  let currentValue = +$(`.${className}`).find("b").text();
  currentValue -= 1;

  if(currentValue === 0) {
    $(`.${className}`).html("");
  } else {
    $(`.${className}`).html(`(<b>${currentValue}</b>)`);
  }
}
