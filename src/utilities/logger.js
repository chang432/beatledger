const isProduction = false
const isProductionQuery = false

exports.isProduction = isProduction
exports.isProductionQuery = isProductionQuery

exports.log = (message, ...args) => {
  if (!isProduction && args[0] == "header") console.log("********** " + message + " **********");
  else if (!isProduction) console.log(message, args)
}

exports.error = (err) => {
  if (!isProduction) console.error(err)
}