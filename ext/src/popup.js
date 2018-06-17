var keywords_active = null;
var port_to_background = null;
var port_from_background = null;

// On open immediately get persistent data
(function() {
  chrome.runtime.sendMessage({
      action: "get_user_state"
    },
    function(response) {
      appendKeywords(response.switched_on, response.data);
    });
  setupBackgroundPort();
  listenForToggle(messageBackground);
  listenForTyping();
  })();


function appendKeywords(switched_on, keywords) {
  if (switched_on == true) {
    $('#keyword-switch').bootstrapToggle('on');
  } else {
    $('#keyword-switch').bootstrapToggle('off');
  }
  if (keywords == null || keywords == "") {
    // Do nothing
  } else {
    $('#keywords').val(keywords);
  }
}

function listenForToggle(callback) {
  $('#keyword-switch').change(function() {
       callback({
         action: 'switch_keywords',
         data: $(this).prop('checked')
       });
     });
    }

function listenForTyping(callback) {
  $('#keywords').change(function() {
       callback({
         action: 'modify_keywords',
         data: $(this).val()
       });
     });
    }




function setupBackgroundPort() {
   port_to_background = chrome.runtime.connect({
      name: 'popup > background'
    });
    port_to_background.onDisconnect.addListener(function(msg) {
      port_to_background = null;
      port_from_background = null;
    });
    port_from_background.onMessage.addListener(function(msg) {
      switch (msg.action) {
        case 'retrieve_keywords':
          retrieve_keywords();
          break;
        case 'modify_keywords':
          modify_keywords(msg.data);
          break;
        case 'switch_keywords_off':
          switch_keywords_off();
          break;
        case 'switch_keywords_on':
          switch_keywords_on();
          break;
        case 'retrieve_keyword_state':
          retrieve_keyword_state();
          break;
      }
    });
  }

  // Our port to message background
  function messageBackground(message) {
    try {
      port_to_background.postMessage(message);
    } catch (e) {
      port_to_background = chrome.runtime.connect({
        name: 'popup > background'
      });
      port_to_background.onDisconnect.addListener(function(msg) {
        port_to_background = null;
        port_from_background = null;
      });
      port_to_background.postMessage(message);
    }
  }
