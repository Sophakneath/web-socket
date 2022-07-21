let stompClient = null;

function setConnected(connected) {
    document.getElementById('connect').disabled = connected;
    document.getElementById('disconnect').disabled = !connected;
    document.getElementById('from').disabled = connected;
    // document.getElementById('conversationDiv').style.visibility
    // = connected ? 'visible' : 'hidden';
}

function connect() {
    const url = "ws://localhost:8080/chat";
    stompClient = Stomp.client(url);
    // const socket = new SockJS('/chat');
    // stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        setConnected(true);
        stompClient.subscribe('/topic/messages', function(messageOutput) {
            showNewMessage(JSON.parse(messageOutput.body));
        });
        stompClient.subscribe('/topic/user', function(userOutput) {
            showNewUser(JSON.parse(userOutput.body));
        });
        sendNewUser()
    });
}

function disconnect() {
    if(stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    const from = document.getElementById('from').value;
    const text = document.getElementById('text').value;
    stompClient.send("/app/chat", {},
    JSON.stringify({'from':from, 'text':text}));
}

function sendNewUser(){
    const name = document.getElementById('from').value;
    stompClient.send("/app/user", {}, JSON.stringify({'name':name}));
}

function showNewUser(userOutput) {
    console.log('User new: ' + userOutput.name);
    $('<li class="contact"><div class="wrap"><span class="contact-status online"></span><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><div class="meta"><p class="name">' + userOutput.name + '</p><p class="preview">Nice to meet you!</p></div></div></li>').appendTo($('.contacts ul'));
}

function showNewMessage(messageOutput) {
    const from = document.getElementById('from').value;
    if (from !== messageOutput.from) $('<li class="sent"><div><img src="http://emilcarlsson.se/assets/mikeross.png" alt=""/><h4 style="padding: 10px;">' + messageOutput.from + '</h4></div><p id="response">' + messageOutput.text + '</p></li>').appendTo($('.messages ul'));
    else $('<li class="replies"><div><img src="http://emilcarlsson.se/assets/mikeross.png" alt=""/></div><p id="response">' + messageOutput.text + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
}