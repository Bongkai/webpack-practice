module.exports = function(css) {
  if(window.innerWidth <= 768) {
    return css;
  } else {
    return css.replace('green', 'blue');
  }
};