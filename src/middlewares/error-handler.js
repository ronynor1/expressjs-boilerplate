function ErrorHandler(Error, req, res, next){
  
  res.status(Error.status || 500).send({
    "code":Error.code || "Internal Server Error"
  });
}

module.exports = ErrorHandler;
