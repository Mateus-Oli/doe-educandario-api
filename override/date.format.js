/**
 * @desc Insert 0's at left
 * @param {number} total size of pad
 * @return {string} number with pad
 */
Number.prototype.padding = function padding(size) {

  // 0's to be Inserted
  let zeros = '';

  // Possible Almount of 0's
  for(let count = 0; count < size; count++) {
    zeros += '0';
  }

  // Shift String to Correct Size of Number
  return (zeros + this).slice(-size);
};

/**
 * @desc Format Date to Specific Format
 * @param {string} format Format to Format Date
 * @return {string} date formated
 */
Date.prototype.format = function format(format) {

  // Possible Formats

  // WeekDay
  format = format.replace(/[w]{4}/g, this.toLocaleString(this.locale, {weekday: 'long'}));
  format = format.replace(/[w]{3}/g, this.toLocaleString(this.locale, {weekday: 'short'}));
  format = format.replace(/[w]{2}/g, this.getDay().padding(2));

  // MonthDay
  format = format.replace(/[d]{2}/g, this.getDate().padding(2));

  // Month
  format = format.replace(/[M]{4}/g, this.toLocaleString(this.locale, {month: 'long'}));
  format = format.replace(/[M]{3}/g, this.toLocaleString(this.locale, {month: 'short'}));
  format = format.replace(/[M]{2}/g, (this.getMonth() + 1).padding(2));

  // Year
  format = format.replace(/[y]{4}/g, this.getFullYear().padding(4));
  format = format.replace(/[y]{2}/g, this.getYear().padding(2));

  // Hour, Minute, Second
  format = format.replace(/[h]{2}/g, this.getHours().padding(2));
  format = format.replace(/[m]{2}/g, this.getMinutes().padding(2));
  format = format.replace(/[s]{2}/g, this.getSeconds().padding(2));

  // String Replaced With Date
  return format;
};

module.exports = {
  Date,
  Number
}
