$(document).ready(function () {
  $('.sidebar').load("/../sidebar.html");
});
function resizeIframe(obj) {
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}