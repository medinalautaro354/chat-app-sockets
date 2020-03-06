
var params = new URLSearchParams(window.location.search);
var name = params.get('name');
var room = params.get('room');

var divUsers = $("#divUsuarios");
var sendForm = $("#sendForm");
var menssageText = $('#menssageText');
var divChatbox = $('#divChatbox');

function userRendering(peoples) {
  console.log(peoples);

  var html = "";

  html += "<li>";
  html += '<a href="javascript:void(0)" class="active">';
  html += "Chat de <span> " + params.get("room") + "</span>";
  html += " </a>";
  html += "</li>";

  for (var i = 0; i < peoples.length; i++) {
    html += "<li>";
    html +=
      "<a data-id=" +
      peoples[i].peopleId +
      ' href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' +
      peoples[i].name +
      ' <small class="text-success">online</small></span></a>';
    html += "</li>";
  }

  divUsers.html(html);
}

function menssageRendering(data, me){

    var date = new Date(data.date);
    var hour = date.getHours() + ':' + date.getMinutes();

    var adminClass = 'info';
    if(data.name === 'Admin'){
        adminClass = 'danger';
    }
    var html ="";

    if(me){
        html +='        <li class="reverse animated fadeIn">';
        html +='             <div class="chat-content">';
        html +='                <h5>'+ data.name +'</h5>';
        html +='                     <div class="box bg-light-inverse">'+ data.menssage +'</div>';
        html +='                </div>';
        html +='            <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html +='            <div class="chat-time">'+ hour +'</div>';
        html +='        </li>';

    }else{

        html += '<li class="animated fadeIn">';
        if(data.name !== 'Admin'){
            html += '     <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '           <div class="chat-content">';
        html += '               <h5>'+ data.name +'</h5>';
        html += '            <div class="box bg-light-'+ adminClass +'">'+ data.menssage+'</div>';
        html += '    </div>';
        html += '       <div class="chat-time">'+ hour +'</div>';
        html += '</li>';
    }
    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

divUsers.on("click", "a", function() {
  var id = $(this).data("id");

  if (id) {
  }
});

sendForm.on("submit", function(e) {
  e.preventDefault();

  if(menssageText.val().trim().length > 0){
    socket.emit('createMenssage', {name:name,
    menssage: menssageText.val()}, function(menssage){
        menssageText.val('').focus();

        console.log(menssage);
        menssageRendering(menssage, true);
        scrollBottom();
    });

    
  }
});
