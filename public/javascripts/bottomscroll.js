var out = document.getElementById("messages");

var add = setInterval(function() {
    // allow 1px inaccuracy by adding 1
    var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
    // console.log(out.scrollHeight - out.clientHeight,  out.scrollTop + 1);
    // scroll to bottom if isScrolledToBotto
    if(isScrolledToBottom)
      out.scrollTop = out.scrollHeight - out.clientHeight;
}, 1000);

function scrollToBottom() {
      out.scrollTop = out.scrollHeight - out.clientHeight;
}
