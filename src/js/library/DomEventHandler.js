function SmoothlyMenu() {
  if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
    // Hide menu in order to smoothly turn on when maximize menu
    $('#side-menu').hide();
    // For smoothly turn on menu
    setTimeout(function() {
      $('#side-menu').fadeIn(400);
    }, 200);
  } else if ($('body').hasClass('fixed-sidebar')) {
    $('#side-menu').hide();
    setTimeout(function() {
      $('#side-menu').fadeIn(400);
    }, 100);
  } else {
    // Remove all inline style from jquery fadeIn function to reset menu state
    $('#side-menu').removeAttr('style');
  }
}

export function bindDomEvent() {
  // Minimalize menu
  $('.navbar-minimalize').on('click', function() {
    $("body").toggleClass("mini-navbar");
    SmoothlyMenu();
  });

  // Add body-small class if window less than 768px
  if ($(document).width() < 769) {
    $('body').addClass('body-small');
  } else {
    $('body').removeClass('body-small');
  }

  // MetisMenu
  $('#side-menu').metisMenu();

  // Collapse ibox function
  $('.collapse-link').on('click', function() {
    let ibox = $(this).closest('div.ibox');
    let button = $(this).find('i');
    let content = ibox.children('.ibox-content');
    content.slideToggle(200);
    button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
    ibox.toggleClass('').toggleClass('border-bottom');
    setTimeout(function() {
      ibox.resize();
      ibox.find('[id^=map-]').resize();
    }, 50);
  });
}
