$(function(){
	$('#config-form').submit(function(event){
		event.preventDefault();
		var msg = {type: 'config'};
		setTimeout(function() {
			$(this).serializeArray().forEach(function(obj) {
				if(obj.name === 'config') {
					msg.config = obj.value;
				}
			});
			console.log(msg);
			$.post('/', msg, function(data){
				var info = JSON.parse(data);
				var reqestID = info.reqID;
				var secret = info.secret;
				var done = false;

				setTimeout(check, 1000);

				function check() {
					$.post('/', {type: 'check', reqID: reqestID, secret: secret}, function(done){
						if(done === 'Done') {
							fetchFile();
						} else if (done === 'Compiling') {
							setTimeout(check, 1000);
						} else if (done === 'Waiting') {
							setTimeout(check, 1000);
						}
					});
				}

				function fetchFile() {
					var form = $("<form>").attr({ target: '_self', method: 'post', action: '' });
					var type = $('<input>').attr({ name: "type", value: 'fetch' });
					var id = $('<input>').attr({ name: "id", value: reqestID });
					var secret = $('<input>').attr({ name: "secret", value: secret });
					form.append(type).append(id).append(secret).submit();
				}
			})
		}.bind(this),1)
		
	});

	
})
