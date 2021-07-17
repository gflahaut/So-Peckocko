const gap = 970;

/**
 * [maskEmail description]
 *
 * @param   {String}   email     [email description]
 * @param   {Boolean}  [reveal]  [email description]
 *
 * @return  {String}             [return description]
 */
exports.maskEmail = (email, reveal=false) => {
  let newMail = "";
  let asciiCode;
  for(let i=email.length-1; i >= 0; i--){
    asciiCode = reveal ? email.charCodeAt(i) - gap : email.charCodeAt(i) + gap;
    newMail += String.fromCharCode(asciiCode);
  }
  return newMail;
};


/**
 * [reveal description]
 *
 * @param   {String}  email  [email description]
 *
 * @return  {String}         [return description]
 */
exports.revealEmail = (email) => {
  return maskEmail(email,true);
};
