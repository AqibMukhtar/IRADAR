var say = require('say');
var fs = require('fs');
var five = require("johnny-five");
var board = new five.Board();

const limit = 5;
var right, back, farward, left;
var message = "";
var timeElpased = 0;
var log = "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n" + Date().toString() + "\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
var notes = "Asalam-o-alikum, this project is being presented as Computer Architecture and Organization course thought by Miss Sana Fatima. Developers of this project include Aqib Mukhtar as group leader, Muhammad Uzair, Abdul Rehman, Abdullah Sohail and Anas Baig.";

board.on('connect', () => {
  say.speak(notes);
});

board.on("ready", function () {
  var a = new five.Led({
    pin: 8
  });

  var b = new five.Led({
    pin: 9
  });

  var lcd = new five.LCD({
    pins: [2, 3, 4, 5, 6, 7],
    rows: 2,
    cols: 16
  });

  setTimeout(() => {
    var today = new Date();
    lcd.clear();
    lcd.cursor(0, 0);
    lcd.print('Date: ' + today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear());
    lcd.cursor(1, 0);
    lcd.print('Time: ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds());
  }, 1000);

  setInterval(display, 500);

  setInterval(() => {
    var today = new Date();
    lcd.clear();
    lcd.cursor(0, 0);
    lcd.print('Date: ' + today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear());
    lcd.cursor(1, 0);
    lcd.print('Time: ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds());
  }, 1000);

  setInterval(() => {
    if (message == "Apply breaks") {
      a.on();
      b.on();
    }
    else if (message == "Move right") {
      a.off();
      b.on();
    }
    else if (message == "Move left") {
      a.on();
      b.off();
    }
    else {
      a.off();
      b.off();
    }
  }, 530);

  var proximityR = new five.Proximity({
    controller: "HCSR04",
    pin: 13,
    freq: 500
  });

  var proximityB = new five.Proximity({
    controller: "HCSR04",
    pin: 12,
    freq: 500
  });

  var proximityF = new five.Proximity({
    controller: "HCSR04",
    pin: 11,
    freq: 500
  });

  var proximityL = new five.Proximity({
    controller: "HCSR04",
    pin: 10,
    freq: 500
  });

  proximityR.on("data", function () {
    right = this.in;
  });

  proximityB.on("data", function () {
    back = this.in;
  });

  proximityF.on("data", function () {
    farward = this.in;
  });

  proximityL.on("data", function () {
    left = this.in;
  });

});

board.on('exit', function () {
  console.clear();
  console.log("Updating log file");
  fs.appendFile('CAO_log.txt', log, (err) => { });
});

function display() {
  console.clear();

  console.log("Time elpased:\t" + timeElpased + "\tseconds");
  console.log("________________________________________________________________________________________________");

  console.log('Distance from right:');
  console.log(right);

  console.log('Distance from back:');
  console.log(back);

  console.log('Distance from front:');
  console.log(farward);

  console.log('Distance from left:');
  console.log(left);

  console.log("________________________________________________________________________________________________");

  if (left > limit && right > limit && back > limit && farward > limit) {
    message = "Enjoy your ride"
  }
  else if (left > limit && right > limit && back > limit && farward <= limit) {
    message = "Apply breaks";
  }
  else if (left > limit && right > limit && back <= limit && farward > limit) {
    message = "Speed up";
  }
  else if (left > limit && right > limit && back <= limit && farward <= limit) {
    message = "Move right";
  }
  else if (left > limit && right <= limit && back > limit && farward > limit) {
    message = "Apply breaks";
  }
  else if (left > limit && right <= limit && back > limit && farward <= limit) {
    message = "Apply breaks";
  }
  else if (left > limit && right <= limit && back <= limit && farward > limit) {
    message = "Speed up";
  }
  else if (left > limit && right <= limit && back <= limit && farward <= limit) {
    message = "Move left";
  }
  else if (left <= limit && right > limit && back > limit && farward > limit) {
    message = "Apply breaks";
  }
  else if (left <= limit && right > limit && back > limit && farward <= limit) {
    message = "Apply breaks";
  }
  else if (left <= limit && right > limit && back <= limit && farward > limit) {
    message = "Speed up";
  }
  else if (left <= limit && right > limit && back <= limit && farward <= limit) {
    message = "Move right";
  }
  else if (left <= limit && right <= limit && back > limit && farward > limit) {
    message = "Apply breaks";
  }
  else if (left <= limit && right <= limit && back > limit && farward <= limit) {
    message = "Apply breaks";
  }
  else if (left <= limit && right <= limit && back <= limit && farward > limit) {
    message = "Speed up";
  }
  else if (left <= limit && right <= limit && back <= limit && farward <= limit) {
    message = "Kalma-e-Shahadat";
  }

  console.log("Suggestion: " + message);
  console.log("================================================================================================");

  log += ("Time elpased: " + timeElpased + "\n________________________________________________________________________________________________\n");
  log += ("Distance from right: " + right + "\nDistance from back : " + back + "\nDistance from front: " + farward + "\nDistance from left : " + left);
  log += ("\nSuggestion: " + message + "\n================================================================================================\n");

  timeElpased += 0.5;
}