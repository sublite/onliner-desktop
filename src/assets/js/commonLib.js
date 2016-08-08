function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function toggleInfoMsg() {
  $('.shadow').toggle();
}

function formatData(date) {
  var nowDate = new Date(Date.now());
  var dateFromHistory = new Date(date);
  var period = "";
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if (dateFromHistory.getDate() == nowDate.getDate()) {
    period += dateFromHistory.getHours() < 10 ? "0" + dateFromHistory.getHours() : dateFromHistory.getHours();
    period += ":";
    period += dateFromHistory.getMinutes() < 10 ? "0" + dateFromHistory.getMinutes() : dateFromHistory.getMinutes();
  } else if (date === null) {
    period = "online";
  } else {
    period += dateFromHistory.getDate() < 10 ? "0" + dateFromHistory.getDate() : dateFromHistory.getDate();
    period += " ";
    period += monthNames[dateFromHistory.getMonth()];
    period += " ";
    period += dateFromHistory.getHours() < 10 ? "0" + dateFromHistory.getHours() : dateFromHistory.getHours();
    period += ":";
    period += dateFromHistory.getMinutes() < 10 ? "0" + dateFromHistory.getMinutes() : dateFromHistory.getMinutes();
  }
  return period;
}

function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

function msToTime(duration) {
      var milliseconds = parseInt((duration%1000)/100);
      var seconds = parseInt((duration/1000)%60);
      var minutes = parseInt((duration/(1000*60))%60);
      var hours = parseInt((duration/(1000*60*60))%24);
      //return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
      return hours + " " + declOfNum(hours, ['час', 'часа', 'часов']) + " " + minutes + " " + declOfNum(minutes, ['минута', 'минуты', 'минут']);
  }

function calculateSummary(usersList) {
  var summary = {};
  for (var i in usersList) {
    if (usersList[i].timeAlreadyFormattedAndCalculated === true) continue;
    var summerySecondsOnlineFromDesktop = 0;
    var summerySecondsOnlineFromMobile = 0;
    var uid = usersList[i].uid;
    for (var j in usersList[i].history) {
      var historySession = usersList[i].history[j];
      var startSession = new Date(historySession[0]);
      var endSession = new Date(historySession[1]);
      var gadgetType = historySession[2];
      var sessionDuration = endSession - startSession;
      if (gadgetType == 1) {
        summerySecondsOnlineFromMobile += sessionDuration;
      } else {
        summerySecondsOnlineFromDesktop += sessionDuration;
      }
    }
    summary[uid] = "Итоговый онлайн.<br>С мобильника: " + msToTime(summerySecondsOnlineFromMobile) + "<br>С компа: " + msToTime(summerySecondsOnlineFromDesktop);
  }
  return summary;
}

var mapFormatFunction = function(user) {
  if (user.timeAlreadyFormattedAndCalculated === true) return user;
  for (var historyItem in user.history) {
    user.history[historyItem][0] = formatData(user.history[historyItem][0]);
    user.history[historyItem][1] = formatData(user.history[historyItem][1]);
    user.timeAlreadyFormattedAndCalculated = true;
  }
  return user;
};

function parseDataSet(i, data, stories) {
  var uName = data[i].first_name + " " + data[i].last_name;
  var uAva = data[i].photo_50;
  var userID = data[i].uid;
  var uStory = stories[i] ? stories[i] : null;
  return {'uName': uName, 'uAva':uAva, 'userID':userID, 'uStory':uStory};
}

function getUIDFromProfileLink(link) {
  var userID = 0;
  if (link.indexOf("id") > 0) {
    userID = link.substring(link.indexOf("id")+2);
  } else if (link.indexOf(".com") > 0) {
    userID = link.substring(link.indexOf(".com")+5);
  } else {
    userID = false;
  }
  return userID;
}
