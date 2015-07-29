$(function(){
	$('#config-form').submit(function(event){
		event.preventDefault();
    var modalIns = $('#loading-modal');
    $('div#message').html('Initializing');
    modalIns.modal();


		var msg = {type: 'config'};
		setTimeout(function() {
			$(this).serializeArray().forEach(function(obj) {
				if(obj.name === 'config') {
					msg.config = obj.value;
				}
			});
			console.log(msg);
			$.post('/', msg, function(info){
        console.log('Done Config', info);
				var reqestID = info.reqID;
				var secret = info.secret;
				var done = false;

				setTimeout(check, 1000);

				function check() {
          var msg = {type: 'check', reqID: reqestID, secret: secret}
					$.post('/', msg, function(status){
						if(status === 'Done') {
              modalIns.modal('close');
							fetchFile();
						} else if (status === 'Compiling') {
							setTimeout(check, 1000);
						} else if (status.indexOf('Waiting') != -1 ) {
							setTimeout(check, 1000);
						}
            $('div#message').html(status);
            console.log('Status: ', status)
					});
				}

				function fetchFile() {
					var form = $('<form><form/>').attr({id:'getFile', method: 'post', action: '/' });
					var type = $('<input/>').attr({ name: 'type', value: 'fetch' });
					var id = $('<input/>').attr({ name: 'reqID', value: reqestID });
					var secretBox = $('<input/>').attr({ name: 'secret', value: secret });
					form.append(type).append(id).append(secretBox);
          form.hide();
          $('#amz-main').append(form);
          form.submit();
          console.log('Fetching');
				}
			})
		}.bind(this),1)

	});


})