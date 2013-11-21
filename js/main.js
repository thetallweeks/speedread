var SPEEDREAD = {

  config : {

    // Sets default font-family
    font: "lora",

    // Sets default words per minute
    speed : 300,

    chunkSize : 3

  },

  init : function(config) {

    SPEEDREAD.createUIVariables();

    SPEEDREAD.bindUI();

    // Begin watching Speed Setting Input
    SPEEDREAD.watchSpeedSetting($speedInput);
    SPEEDREAD.watchChunkSizeSetting($chunkSizeInput);

    // Begin watching text input
    SPEEDREAD.watchTextArea($textInput);

    words = [];

    // Create a global variable for the setTimeout interval
    var interval;

    placeholder = 0;

    isPlaying = false;

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

  },

  bindUI : function() {

    // Hide menus when clicking off of target
    $('html').click(function() {
      $popupMenus.addClass('is-hidden');
      $speedSettings.removeClass('is-active');
      $fontSettings.removeClass('is-active');
    });

    // Set the word display to hidden by default
    $wordDisplayContainer.addClass('is-hidden');

    // Hide Speed Settings popup
    $popupMenus.addClass('is-hidden');

    // Bind click function for play/pause
    $playPauseButton.click(function() {
      if(words.length > 0) {
        if(!isPlaying) {
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
    $popupButtons.click(function() {
      SPEEDREAD.popup();
    });

    $popupMenus.click(function() {
      event.stopPropagation();
    });

  },

  watchTextArea : function(input) {

    // Watch textarea for changes
    input.on('input', function() {
      SPEEDREAD.createWords(input);
      $wordCountDisplayer(words);
    });

  },

  createWords : function(input) {

    // Create teh pattern using the chunkSize value
    var pattern = '[^ ]+( +[^ ]+){0,' + (SPEEDREAD.config.chunkSize - 1) + '}';

    // We need to create a RegEx object to be able to use the
    // pattern variable. 'g' prevents the RegEx from stopping at
    // the first match
    var re = new RegExp(pattern, 'g');

    // Creates words array from input text
    words = input.val().match(re);

  },

  wordCounter : function(array) {

    // Create variable to hold word count
    var wordCount = array.length;

    // Update word count with new value
    $wordCountDisplay.html(wordCount);

  },

  popup : function() {

    event.stopPropagation();

    var target = $(event.target);

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
      SPEEDREAD.setSpeed();
    });
  },

  setSpeed : function() {

    // Make sure words per minute is greater than 0
    if($speedInput.val() < 1) {
      $speedInput.val(1);
    }
    SPEEDREAD.config.speed = $speedInput.val();

    // Update Speed display
    $speedDisplay.html(SPEEDREAD.config.speed);

  },

  watchChunkSizeSetting : function(input) {

    // Set new Speed value
    input.on('input', function() {
      SPEEDREAD.setChunkSize();
    });
  },

  setChunkSize : function() {

    // Update Speed display
    if($chunkSizeInput.val() < 1) {
      $chunkSizeInput.val(1);
    }
    SPEEDREAD.config.chunkSize = $chunkSizeInput.val();

    if(SPEEDREAD.config.chunkSize === 1) {
      $chunkSizeDisplay.html(SPEEDREAD.config.chunkSize + ' word');
    } else {
      $chunkSizeDisplay.html(SPEEDREAD.config.chunkSize + ' words');
    }

    SPEEDREAD.createWords($textInput);

    // TODO: Add class on wordsDisplay to alter font size
    // based on chunkSize

  },

  chooseFont : function() {
    SPEEDREAD.setFont();
    $fontSettingsMenu.find('.font-option').click(function() {
      $fontSettingsMenu.find('.font-option').removeClass('is-active');

      // Don't create a jQuery object here
      SPEEDREAD.config.font = event.target.id;

      // Use the jQuery object form of event.target to addClass
      $(event.target).addClass('is-active');
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

  displayWords : function() {

    // Show Word Display
    $wordDisplayContainer.removeClass('is-hidden');

    // Hide Input
    $textInputContainer.addClass('is-hidden');

    console.log(SPEEDREAD.config.chunkSize);

    // Convert speed to ms
    var speedInMS = (1 / ((SPEEDREAD.config.speed / SPEEDREAD.config.chunkSize) / 60)) * 1000;

    var i = placeholder,
        j = words.length;

    (function timer() {
      $wordDisplay.html(words[i]);
      i++;
      if (i === j) {
        SPEEDREAD.resetDisplayWords();
      } else if (i < j) {
        placeholder++;
        interval = setTimeout(timer,speedInMS);
      }
    })();

  },

  resetDisplayWords : function() {
    isPlaying = false;

    // TODO: Error when chunkSize is larger than words.length
    clearTimeout(interval);
    placeholder = 0;
    $playPauseButton.removeClass('icon-pause').addClass('icon-play');
  },

  stopDisplayWords : function() {

    // Prevent display speed from increasing
    clearTimeout(interval);
    placeholder = 0;
    isPlaying = false;
    $wordDisplayContainer.addClass('is-hidden');
    $wordDisplay.empty();
    $textInputContainer.removeClass('is-hidden');
    $playPauseButton.removeClass('icon-pause').addClass('icon-play');
  },

  play : function() {
    $playPauseButton.removeClass('icon-play').addClass('icon-pause');
    SPEEDREAD.displayWords();
    isPlaying = true;
  },

  pause : function() {
    $playPauseButton.removeClass('icon-pause').addClass('icon-play');
    clearTimeout(interval);
    isPlaying = false;
  }

};

$(document).ready(SPEEDREAD.init);
