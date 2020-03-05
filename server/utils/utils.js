const createMenssage = (name, menssage) => {
  return {
    name,
    menssage,
    date: new Date().getTime()
  };
};

module.exports = {
  createMenssage
};
