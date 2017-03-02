function validation() {
  return {
    objectIds: validateObjectIds,
    socketIds: validateSocketIds
  }
}

function checkRegExp(regExp, args) {
  var result = true;
  for (var i = 0; i < args.length; i++) {
    if (regExp.test(args[i]) === false && args[i] !== null) {
      result = false;
      break;
    }
  }
  return result;  
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

function validateSocketIds() {
  var regExp = new RegExp(/^[a-zA-Z0-9_-]+$/);
  var result = checkRegExp(regExp, arguments);
  return result;
}


module.exports = validation(); 