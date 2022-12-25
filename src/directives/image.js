export default function(el, binding) {
  // if (binding.value) {
  //   el.classList.add("state-loading");
  //   el.setAttribute("disabled", "disabled");
  // } else {
  //   el.classList.remove("state-loading");
  //   el.removeAttribute("disabled");
  // }
  var img = new Image();
  img.src = binding.value;

  img.onload = function() {
    el.src = binding.value;
    // $(this.el).css('opacity', 0).animate({ opacity: 1 }, 1000)
  }.bind(this);
}
