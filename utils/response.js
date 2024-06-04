const successResponseWithData = (status, message, data) => {
  return {
    status: status,
    message: message,
    data: data,
  };
};

const errorResponse = (status, message, error) => {
  return {
    status: status,
    message: message,
    errors: error,
  };
};

module.exports = { successResponseWithData, errorResponse };
