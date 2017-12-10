
sharing.addEventListener("change", function() {
	dname_wrapper = document.getElementById("dname-wrapper")
	if (sharing.value == "domain") {
		dname_wrapper.style.display = ""
	} else {
		dname_wrapper.style.display = "none"
	}
})


// Saves options to chrome.storage.sync.
function save_options() {
  var sharing = document.getElementById('sharing').value;
  var dname = document.getElementById('dname').value;

  chrome.storage.sync.set({
    sharing: sharing,
    domain_name: dname
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    sharing: 'me',
    domain_name: ""
  }, function(items) {
    document.getElementById('sharing').value = items.sharing;
    document.getElementById('dname').value = items.domain_name;
		if (items.sharing == "domain") {
			dname_wrapper = document.getElementById("dname-wrapper")
			dname_wrapper.style.display = ""
		}
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);



