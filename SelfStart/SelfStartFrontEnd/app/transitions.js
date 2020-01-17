export default function(){
  // Add your transitions here, like:
  //   this.transition(
  //     this.fromRoute('people.index'),
  //     this.toRoute('people.detail'),
  //     this.use('toLeft'),
  //     this.reverse('toRight')
  //   );

  this.transition(
    this.hasClass('editing'),

    // this makes our rule apply when the liquid-if transitions to the
    // true state.
    this.toValue(true),
    this.use('toLeft' , {duration: 700}),

    // which means we can also apply a reverse rule for transitions to
    // the false state.
    this.reverse('toRight', {duration: 500} )
  );
}
