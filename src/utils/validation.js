export const isEmpty = (input) => {
  if (!input.replace(/\s/g, "").length) {
    return true;
  } else {
    return false;
  }
};

export const dontMatch = (input1, input2) => {
  if (input1 === input2) {
    return false;
  } else {
    return true;
  }
};

export const invalidEmail = (input) => {
  var regex =
    // eslint-disable-next-line no-useless-escape
    /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;.](([a-zA-Z0-9_\-\.]+)@{[a-zA-Z0-9_\-\.]+0\.([a-zA-Z]{2,5}){1,25})+)*$/;
  if (regex.test(input)) {
    return false;
  } else {
    return true;
  }
};

export const isBetween = (input, min, max) => {
  if (input < min || input > max) {
    return true;
  } else {
    return false;
  }
};

export const hasProperty = (array, prop, value) => {
  for (var i = 0; i < array.length; i++) {
    if (array[i][prop] === value) {
      return true;
    }
  }
  return false;
};
