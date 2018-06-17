// background remains persistent in order to hold keywords

var port_to_popup = null;
var port_from_popup = null;
var keywords = null;
var keywords_active = true;

// Called when popup is opened
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "get_user_state") {
    retrieve_user_state(sendResponse);
    return true;
  } else if (request.action == "page_ready") {
    retrieve_user_state(sendResponse);
    return true;
  }
});
// 
function retrieve_user_state(callback) {
  callback({
    action: 'user_state',
    switched_on: keywords_active,
    data: keywords
  });
}

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === 'popup > background') {
    port_from_popup = port;
    // Setup outgoing port, port_to_popup
    port_to_popup = chrome.runtime.connect({
      name: 'background > popup'
    });

    port_from_popup.onDisconnect.addListener(function(msg) {
      port_from_popup = null;
      port_to_popup = null;
    });
    port_from_popup.onMessage.addListener(function(msg) {
      switch (msg.action) {
        case 'modify_keywords':
          modify_keywords(msg.data);
          break;
        case 'switch_keywords':
          switch_keywords(msg.data);
          break;
      }
    });
  }
});

function modify_keywords(kw) {
  keywords = kw;
}

function switch_keywords(data) {
  if (data == true) {
    keywords_active = true;
  } else {
    keywords_active = false;
  }
}

function messagePopup(message) {
  if (port_to_popup) { // Popup is open and listening
    try {
      port_to_popup.postMessage(message);
    } catch (e) {
      console.log(e);
    }
  }
}
