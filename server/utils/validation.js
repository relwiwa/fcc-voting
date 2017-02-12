function validation() {
  return {
    objectIds: validateObjectIds
  }
}

function validateObjectIds() {
  var objectIdRegex = new RegExp(/^[a-f0-9]{24}$/);
  var result = true;
  for (var i = 0; i < arguments.length; i++) {
    if (objectIdRegex.test(arguments[i]) === false && arguments[i] !== null) {
      result = false;
      break;
    }
  }
  return result;
}

module.exports = validation(); 