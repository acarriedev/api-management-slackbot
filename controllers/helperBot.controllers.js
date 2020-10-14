const getInitialResponse = (req, res, next) => {
  res.send({message: "Hello there"});
}

module.exports = { getInitialResponse };