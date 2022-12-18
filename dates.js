let cDate = new Date().toLocaleString();
let secondsStart = cDate.lastIndexOf(":");
let spliced = cDate.slice(0,secondsStart);
console.log(cDate);
console.log(spliced);