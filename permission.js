
var PermissionController = function(options) {
  var noop = function() {};
  this.token = options.token
  this.onComplete = options.onComplete || noop;
  this.httpMethod = 'POST';
  this.role = options.role || "reader"
  var self = this;
}

PermissionController.prototype.insert = function(fileId, type, domain_name) {
  var self = this;
  var xhr = new XMLHttpRequest();
  url = this.buildUrl_(fileId);

  xhr.open(this.httpMethod, url, true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
  xhr.setRequestHeader('Content-Type', 'application/json');
 
  xhr.onload = function(e) {
    self.onComplete(e)
  }

  xhr.send(JSON.stringify({
    'role' : this.role,
    'type': type,
    'value': domain_name
  }));
};

PermissionController.prototype.buildUrl_ = function(id) {
  var url = "https://www.googleapis.com/drive/v2/files/" + id +  "/permissions"
  return url
};
