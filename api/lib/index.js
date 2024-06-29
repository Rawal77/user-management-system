const showError = (err, next) => {
  next({
    status: 400,
    messsage: `Error ${err.messsage}`,
  });
};

module.exports = {
  showError,
};
