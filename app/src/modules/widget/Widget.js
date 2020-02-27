class Widget {
  constructor( params ) {
    this.name = params.name;
    this.id = params.id;
    this.init();
  }

  init() {
    this.widget = document.createElement( 'div' );
    const head = document.createElement( 'div' );
    const body = document.createElement( 'div' );
    this.widget.classList.add( 'widget' );
    head.classList.add( 'widget__headasd' );
    body.classList.add( 'widget__body' );
    this.widget.appendChild( head );
    this.widget.appendChild( body );
  }
}

module.exports = Widget;
