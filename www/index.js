window.onload = function () {
    var hichat = new HiChat();
    hichat.init();

}
var HiChat = function () {
    this.socket = null;
}

HiChat.prototype = {
    init: function () {
        var that = this;
        this.socket = io.connect()
        // 监听连接
        this.socket.on('connect', function () {
            document.getElementById('userinfo').style.display = 'block';
            document.getElementById('name').focus()
        })
        // 用户名已存在
        this.socket.on('usernameExited', function () {
            alert('用户名已存在')
        })
        // 用户登录成功
        this.socket.on('userSuccess', function () {
            alert('登陆成功')
            document.getElementById('userinfo').style.display = 'none';
            document.getElementById('mask').style.display = 'none';            
        })
        // 监听用户离开聊天室
        this.socket.on('system', function(username, userCount, type) {
            if(username == null) return
            //判断用户是连接还是离开以显示不同的信息
            var msg = username + (type == 'login' ? ' 进入聊天室' : ' 离开了');
            
            var p = document.createElement('p');
            that._displayNewMsg('管理员', msg, 'red');
            //将在线人数显示到页面顶部
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' 在线';
        });
        this.socket.on('newMsg',function(user,msg){
             that._displayNewMsg(user, msg);
        })
        // 用户登录
        document.getElementById('sure').onclick = function () {
            var username = document.getElementById('name').value
            if (username.length !== 0) {
                that.socket.emit('login', username)
            }
        }
        document.getElementById('sendBtn').addEventListener('click', function() {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg); //把消息发送到服务器
                that._displayNewMsg('me', msg); //把自己的消息显示到自己的窗口中
            };
        }, false);
        document.getElementById('name').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('name').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                that.socket.emit('postMsg', msg, '');
                that._displayNewMsg('me', msg, '');
            };
        }, false);
    },
     _displayNewMsg: function(user, msg, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
}