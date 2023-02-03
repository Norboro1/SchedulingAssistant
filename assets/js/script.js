// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
var currentDayEl = $('#currentDay');
var scheduleEl = $('#scheduleDisplay');
var today = dayjs();
var currentHour = parseInt(today.format('H'));
var tasks = JSON.parse(localStorage.getItem('tasks'));

if(!tasks){
  tasks = {};
  for (i=9; i<18; i++){
    tasks[i]='';
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

setInterval(function(){
  today = dayjs();
  console.log('hour variable: '+currentHour + '\nactual hour: ' +parseInt(today.format('H')));
  if(parseInt(today.format('H')) > currentHour){
    currentHour = parseInt(today.format('H'));
    reloadColors();
  }
  currentHour = parseInt(today.format('H'));
}, 30000);

currentDayEl.text(today.format('dddd, MMMM Do'));

function loadSchedule(){
  var hour = 9;
  var ampm;
  for (i=0; i<9; i++){
    if(hour > 12){
      var hourProper = hour-12;
      ampm = "PM";
    } else if (hour ==12){
      hourProper = hour;
      ampm = "PM";
    } else {
      hourProper = hour;
      ampm = "AM";
    }

    var timeBlock = $('<div id='+hour+' class="row time-block">');
    var blockTitle = $('<div class="col-2 col-md-1 hour text-center py-3">');
    var blockTextArea = $('<textarea class="col-8 col-md-10 description" rows="3">');
    var blockButton = $('<button class="btn saveBtn col-2 col-md-1" aria-label="save">');
    blockButton.append('<i class="fas fa-save" aria-hidden="true"></i>');

    blockTextArea.text(tasks[hour]);

    if(hour < currentHour) {
      timeBlock.addClass('past');
    } else if (hour == currentHour){
      timeBlock.addClass('present');
    } else {
      timeBlock.addClass('future');
    }

    blockTitle.text(hourProper.toString()+ampm);
    timeBlock.append(blockTitle, blockTextArea, blockButton);
    scheduleEl.append(timeBlock);

    hour++;
  }

}

function reloadColors(){
  for(i=9; i<18; i++){
    if(i < currentHour) {
      $("#"+i).removeClass('present');
      $("#"+i).removeClass('past');
      $("#"+i).addClass('past');
    } else if (i == currentHour){
      $("#"+i).removeClass('future');
      $("#"+i).removeClass('present');
      $("#"+i).addClass('present');
    } 
  }
}

scheduleEl.on('click', 'button', function(){
  var currentID = $(this).parent().attr('id');
  tasks[currentID] = $(this).siblings('textarea').val();
  localStorage.setItem('tasks', JSON.stringify(tasks));
})

loadSchedule();