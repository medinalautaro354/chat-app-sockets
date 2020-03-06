var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has("name")|| !params.has('room')) {
  window.location = "index.html";
  throw new Error("El nombre y sala son necesarios.");
}

var user = {
  name: params.get("name"),
  room: params.get('room')
};

socket.on("connect", function() {
  console.log("Conectado al servidor");

  socket.emit("enterChat", user, function(response) {
    userRendering(response);
  });
});

// escuchar
socket.on("disconnect", function() {
  console.log("Perdimos conexión con el servidor");
});

// Enviar información
socket.emit(
  "enviarMensaje",
  {
    usuario: "Fernando",
    mensaje: "Hola Mundo"
  },
  function(resp) {
    console.log("respuesta server: ", resp);
  }
);

// Escuchar información
socket.on("createMenssage", function(menssage) {
    menssageRendering(menssage, false);
    scrollBottom();
    
});

socket.on("menssagePrivate", function(menssage) {
  console.log("Mensaje privado: ", menssage);
});

socket.on("showPersons", function(persons) {
    userRendering(persons);
  console.log(persons);
});
