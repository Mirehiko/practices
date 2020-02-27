$( '.classname' ).on( 'scroll', function( e ) {
  e.preventDefault();
  const top = $( this ).parent().find( '.indicatorUp' );
  const bottom = $( this ).parent().find( '.indicatorDown' );
  const boxes = $( this ).parent().find( '.indicatorBox' );
  if ( $( this ).scrollTop() + $( this ).innerHeight() >= $( this )[ 0 ].scrollHeight ) {
    bottom.attr( 'state', 'hidden' );
  }
  else if ( $( this ).scrollTop() === 0 ) {
    top.attr( 'state', 'hidden' );
  }
  else {
    boxes.attr( 'state', 'visible' );
  }
} );
