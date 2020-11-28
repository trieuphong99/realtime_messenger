export let bufferToBase64 = function(bufferFrom) {
  return Buffer.from(bufferFrom).toString("base64");
};