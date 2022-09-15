const bcrypt = require("bcryptjs");

exports.Encryption = (text) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(text, salt);
  return hash;
};

exports.bcryptCompaire = (text, hash) => {
    const compaire = bcrypt.compareSync(text, hash)
    return compaire;
};
