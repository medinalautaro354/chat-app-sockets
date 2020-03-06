const { io } = require("../server");
const { User } = require("../classes/users");
const user = new User();
const { createMenssage } = require("../utils/utils");

io.on("connection", client => {
  client.on("enterChat", (data, callback) => {
    if (!data.name || !data.room) {
      return callback({
        err: true,
        menssage: "El nombre y la sala son necesarios."
      });
    }

    client.broadcast.to(data.room).emit(
        "createMenssage",
        createMenssage("Admin", `${data.name} se unió al chat.`)
      );

    client.join(data.room);

    user.addPerson(client.id, data.name, data.room);

    client.broadcast.to(data.room).emit("showPersons", user.getPersons());

    callback(user.getPersonsForRoom(data.room));
  });

  client.on("createMenssage", (data, callback) => {
    let person = user.getPerson(client.id);
    let menssage = createMenssage(person.name, data.menssage);
    client.broadcast.to(person.room).emit("createMenssage", menssage);
    
    callback(menssage);
  });

  client.on("disconnect", () => {
    let deletedPerson = user.deletePerson(client.id);

    client.broadcast.to(deletedPerson.room).emit(
      "createMenssage",
      createMenssage("Admin", `${deletedPerson.name} se desconecto.`)
    );

    client.broadcast.to(deletedPerson.room).emit("showPersons", user.getPersonsForRoom(deletedPerson.room));
  });

  client.on("menssagePrivate", data => {
    if (!data.id) {
      throw new Error("El usuario es necesario.");
    }

    if (!data.menssage) {
      throw new Error("El mensaje es necesario.");
    }

    let person = user.getPerson(client.id);
    client.broadcast
      .to(data.personId)
      .emit("menssagePrivate", createMenssage(person.name, data.menssage));
  });
});
