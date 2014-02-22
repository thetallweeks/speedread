var SPEEDREAD = {

  config : {

    // Sets default font-family
    font: "lora",

    // Sets default words per minute
    speed : 300,

    // Set default words at a time
    chunkSize : 1

  },

  init : function(config) {

    SPEEDREAD.createUIVariables();

    // Set the word display to hidden by default
    $wordDisplayContainer.addClass('is-hidden');

    // Hide Speed Settings popup
    $popupMenus.addClass('is-hidden');

    SPEEDREAD.bindUI();
    SPEEDREAD.bindSettings();

    // Watch settings
    SPEEDREAD.watchSpeedSetting($speedInput);
    SPEEDREAD.watchChunkSizeSetting($chunkSizeInput);

    // Watch text input
    SPEEDREAD.watchTextArea($textInput);

    // Create empty words array in the global scope
    words = [];

    // Create a global variable for the setTimeout interval
    interval = null;
    delay = null;

    // Create placeholder in the global scope
    placeholder = 0;

    // Create state variable in the global scope
    state = 0; // 0 = Stopped, 1 = Playing, 2 = Paused, 3 = Paused Artificially

    // Set the default font
    SPEEDREAD.chooseFont();

  },

  createUIVariables : function() {
    // Set DOM elements as variables for reuse
    $textInput = $('#speedReadTextInput');
    $textInputContainer = $('#speedReadTextInputContainer');
    $wordDisplayContainer = $('#speedReadWordDisplayContainer');
    $wordDisplay = $('#speedReadWordDisplay');
    $wordCountDisplay = $('#speedReadWordCountDisplay');
    $playPauseButton = $('#speedReadPlayPause');
    $stopButton = $('#speedReadStop');
    $popupButtons = $('.app-controls-menu-container');
    $popupMenus = $('.app-controls-menu');

    // Speed Settings
    $speedSettings = $('#speedReadSpeedSettings');
    $speedInput = $('#speedReadSpeedInput');
    $speedDisplay = $('#speedReadSpeedDisplay');

    // ChunkSize
    $chunkSizeInput = $('#speedReadChunkSizeInput');
    $chunkSizeDisplay = $('#speedReadChunkSizeDisplay');

    // Font Settings
    $fontSettings = $('#speedReadFontSettings');
    $fontSettingsMenu = $('#speedReadFontSettingsMenu');

    // Progress Bar
    $progressBar = $('#speedReadProgressBar');

  },

  bindUI : function() {

    // Hide menus when clicking off of target
    $('html').click(function() {
      $popupMenus.addClass('is-hidden');
      $speedSettings.removeClass('is-active');
      $fontSettings.removeClass('is-active');
    });

    // Bind click function for play/pause
    $playPauseButton.click(function() {
      if(words.length > 0) {
        if(state === 0 || state === 2) {
          SPEEDREAD.play();
        } else {
          SPEEDREAD.pause();
        }
      }
    });

    // Bind click function for Stop
    $stopButton.click(function() {
      if(words.length > 0) {
        SPEEDREAD.stopDisplayWords();
      }
    });

    // Bind click for Speed Settings
    $popupButtons.click(function(e) {
      SPEEDREAD.popup(e);
    });

    $popupMenus.click(function(e) {
      e.stopPropagation();
    });

  },

  bindSettings : function() {

    // Set speed input value = config value
    $speedInput.val(SPEEDREAD.config.speed);

    // Update speed Display
    SPEEDREAD.setSpeed();

    // Set chunkSize input value = config value
    $chunkSizeInput.val(SPEEDREAD.config.chunkSize);

    // Update chunkSize
    SPEEDREAD.setChunkSize();
  },

  watchTextArea : function(input) {

    // Watch textarea for changes
    input.on('input', function() {
      SPEEDREAD.createWords(input);
      SPEEDREAD.wordCounter($textInput);
    });

  },

  createWords : function(input) {

    // Create the pattern using the chunkSize value
    var pattern = '[^ ]+( +[^ ]+){0,' + (SPEEDREAD.config.chunkSize - 1) + '}';

    // We need to create a RegEx object to be able to use the
    // pattern variable. 'g' prevents the RegEx from stopping at
    // the first match
    var re = new RegExp(pattern, 'g');

    // Replace line breaks with spaces
    // Replace < with &lt;
    // Replace > with &gt;
    words = input.val().replace(/(\r\n+|\n+|\r+)/gm,' ')
                       .replace(/</g,'&lt;')
                       .replace(/>/g,'&gt;');

    // Split words array at every nth space
    words = words.match(re);

  },

  wordCounter : function(input) {

    // Create variable to hold word count
    var wordCount = input.val().trim().split(' ').length;

    // Update word count with new value
    $wordCountDisplay.html(wordCount);

  },

  popup : function(e) {
    e = e || window.event;
    e.stopPropagation();

    var target = $(e.target);

    if(target.hasClass('is-active')) {
      target.removeClass('is-active');
      target.find('.app-controls-menu').addClass('is-hidden');
    } else {
      $popupMenus.addClass('is-hidden');
      $popupButtons.removeClass('is-active');
      target.addClass('is-active');
      target.find('.app-controls-menu').removeClass('is-hidden');
    }
  },

  clearPopup : function() {
    $popupButtons.removeClass('is-active');
    $popupMenus.addClass('is-hidden');
  },

  watchSpeedSetting : function(input) {

    // Set new Speed value
    input.on('input', function() {
      if(state === 1) {
        SPEEDREAD.pause();
        state = 3;
      }
      SPEEDREAD.setSpeed();
      SPEEDREAD.convertSpeedToMS(SPEEDREAD.config.speed);

      // TODO: Set up play button with delay equal to speedInMS
      // This will allow you to increase the speed without having
      // to pause the player
      if(state === 3) {
        clearTimeout(delay);
        delay = setTimeout(function(){
          SPEEDREAD.play();
        }, speedInMS);
      }
    });
  },

  setSpeed : function() {
    // Make sure words per minute is greater than 0
    if($speedInput.val() < 1) {
      SPEEDREAD.config.speed = 1;
    } else {
      SPEEDREAD.config.speed = $speedInput.val();
    }

    // Update Speed display
    $speedDisplay.html(SPEEDREAD.config.speed);
  },

  convertSpeedToMS : function(speed) {
    // Convert speed to ms
    speedInMS = (1 / ((speed / SPEEDREAD.config.chunkSize) / 60)) * 1000;
  },

  watchChunkSizeSetting : function(input) {

    // Set new Speed value
    input.on('input', function() {
      SPEEDREAD.setChunkSize();
      SPEEDREAD.createWords($textInput);
    });
  },

  setChunkSize : function() {

    if($chunkSizeInput.val() < 1) {
      SPEEDREAD.config.chunkSize = 1;
    } else {
      SPEEDREAD.config.chunkSize = $chunkSizeInput.val();
    }

    if(SPEEDREAD.config.chunkSize === 1) {
      $chunkSizeDisplay.html(SPEEDREAD.config.chunkSize + ' word');
    } else {
      $chunkSizeDisplay.html(SPEEDREAD.config.chunkSize + ' words');
    }

  },

  chooseFont : function(e) {
    SPEEDREAD.setFont();
    $fontSettingsMenu.find('.font-option').click(function(e) {
      $fontSettingsMenu.find('.font-option').removeClass('is-active');

      // Don't create a jQuery object here
      SPEEDREAD.config.font = e.target.id;

      // Use the jQuery object form of event.target to addClass
      $(e.target).addClass('is-active');
      SPEEDREAD.removeFontClass();
      SPEEDREAD.setFont();
    });
  },

  removeFontClass : function() {
    $textInput.removeClass('lora montserrat sanchez poly pt-serif roboto georgia');
    $wordDisplay.removeClass('lora montserrat sanchez poly pt-serif roboto georgia');
  },

  setFont : function() {
    $textInput.addClass(SPEEDREAD.config.font);
    $wordDisplay.addClass(SPEEDREAD.config.font);
  },

  displayWords : function(speed) {

    // Show Word Display
    $wordDisplayContainer.removeClass('is-hidden');

    // Hide Input
    $textInputContainer.addClass('is-hidden');

    SPEEDREAD.convertSpeedToMS(SPEEDREAD.config.speed);

    var i = placeholder,
        j = words.length;

    (function timer() {
      $wordDisplay.html(words[i]);
      i++;
      if (i === j) {
        SPEEDREAD.resetDisplayWords();
        $progressBar.width('100%');
      } else if (i < j) {
        placeholder++;
        SPEEDREAD.progressBar(placeholder, j);
        interval = setTimeout(timer,speedInMS);
      }
    })();

  },

  resetDisplayWords : function() {
    clearTimeout(interval);
    placeholder = 0;
    $playPauseButton.removeClass('icon-pause').addClass('icon-play');
  },

  stopDisplayWords : function() {

    // Prevent display speed from increasing
    clearTimeout(interval);
    placeholder = 0;
    state = 0;
    $wordDisplayContainer.addClass('is-hidden');
    $wordDisplay.empty();
    $textInputContainer.removeClass('is-hidden');
    $playPauseButton.removeClass('icon-pause').addClass('icon-play');
    $progressBar.width(0);
  },

  play : function() {
    $playPauseButton.removeClass('icon-play').addClass('icon-pause');
    SPEEDREAD.displayWords(SPEEDREAD.config.speed);
    state = 1;
  },

  pause : function() {
    $playPauseButton.removeClass('icon-pause').addClass('icon-play');
    clearTimeout(interval);
    state = 2;
  },

  progressBar : function(currentPosition, totalItems) {
    var progressPercentage = (currentPosition / totalItems) * 100;
    $progressBar.width(progressPercentage + '%');
  }

};

$(document).ready(SPEEDREAD.init);
