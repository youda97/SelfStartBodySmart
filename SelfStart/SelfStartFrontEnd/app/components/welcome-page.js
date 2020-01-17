import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  tagName:'',

  model: null,

  didRender() {
    this._super(...arguments);

    $(function() {
      $('a[href*=\\#]:not([href=\\#])').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
      });
    });

    /*-----------------------------------------------------------------------------------*/
    /*	PRELOADER
    /*-----------------------------------------------------------------------------------*/

    window.onload = preloader;

    function preloader() {
      //Preloader
      setTimeout("$('#preloader').animate({'opacity' : '0'},300,function(){$('#preloader').hide()})",800);
      setTimeout("$('.preloader_hide, .selector_open').animate({'opacity' : '1'},500)",800);
    }

    $(function () {
      preloader();
    });



  },
});
