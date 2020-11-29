import moment from "moment";

export let bufferToBase64 = function(bufferFrom) {
  return Buffer.from(bufferFrom).toString("base64");
};

export let lastItemOfArray = function(array) {
  if(!array.length) {
    return [];
  }
  return array[array.length-1];
};

export let convertTimeStampToRealTime = (timestamp) => {
  if(!timestamp) {
    return "";
  }
  return moment(timestamp).locale("vi").startOf("seconds").fromNow();
};