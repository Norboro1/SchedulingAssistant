// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html

$( function(){
  //Declare variables for Elements to edit, current day and hour, and get tasks from localstorage or create and set new localstorage item if it doesn't exist.
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

  //Update today variable every 30 seconds and compare with current hour BEFORE updating it, in order to check if the hour has changed.
  //If so will update current hour variable and reload schedule colors to reflect the current time.
  setInterval(function(){
    today = dayjs();
    if(parseInt(today.format('H')) > currentHour){
      currentHour = parseInt(today.format('H'));
      reloadColors();
    }
    currentHour = parseInt(today.format('H'));
  }, 30000);

  // Set header current day text to the current day (this could go in the interval function to update incase user happens to be using app around midnight)
  currentDayEl.text(today.format('dddd, MMMM Do'));

  //Loads and renders the schedule. Chose to create the whole thing with a js loop rather than manually create them all in HTML.
  function loadSchedule(){
    for (i=9; i<18; i++){
      //set dayjs hour variable to easily display the hour, formatted to my choosing, for each hour block.
      var hour = dayjs().hour(i);
      //Create each element for the hour block and set id to its respective hour in 24-hour format.
      var timeBlock = $('<div id='+i+' class="row time-block">');
      var blockTitle = $('<div class="col-2 col-md-1 hour text-center py-3">');
      var blockTextArea = $('<textarea class="col-8 col-md-10 description" rows="3">');
      var blockButton = $('<button class="btn saveBtn col-2 col-md-1" aria-label="save">');
      blockButton.append('<i class="fas fa-save" aria-hidden="true"></i>');
      //sets textarea text based on tasks object which was pulled from localstorage or created fresh (empty)
      blockTextArea.text(tasks[i]);
      //sets hourblock color based on comparison to current hour
      if(i < currentHour) {
        timeBlock.addClass('past');
      } else if (i == currentHour){
        timeBlock.addClass('present');
      } else {
        timeBlock.addClass('future');
      }
      //Display hour formatted in style of '12PM' '9AM' etc., build timeblock element, and add to schedule element
      blockTitle.text(hour.format('hA'));
      timeBlock.append(blockTitle, blockTextArea, blockButton);
      scheduleEl.append(timeBlock);
    }

  }

  // runs through for loop to properly reset each hour block class, only works if hour moved forward by just 1 (regular use. 
  // would not work if user manually changed the time drastically).
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

  //on click function to save the relevant textarea text to local storage.
  scheduleEl.on('click', 'button', function(){
    var currentID = $(this).parent().attr('id');
    tasks[currentID] = $(this).siblings('textarea').val();
    localStorage.setItem('tasks', JSON.stringify(tasks));
  })

  loadSchedule();
})

