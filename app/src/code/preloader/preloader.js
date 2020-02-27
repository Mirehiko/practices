// eslint-disable-next-line no-unused-vars
class Preloader {
  constructor( group ) {
    this._preloader = null;
    this.group = group || 'default';
    this._create();
    return this;
  }

  _create() {
    this._preloader = document.createElement( 'div' );
    $( this._preloader ).addClass( 'preloader' );
    $( this._preloader ).attr( 'group', this.group );
    $( this._preloader ).append( `
        <div class="cssload-container">
          <div class="cssload-loading"><i></i><i></i><i></i><i></i></div>
        </div>
    ` );

    return this;
  }

  get get() {
    return this._preloader;
  }

  static hidePreloaders( group ) {
    $( `.preloader[group="${group}"]` ).attr( 'state', 'hidden' );
  }

  show() {
    $( this._preloader ).attr( 'state', 'visible' );
    return this;
  }

  hide() {
    $( this._preloader ).attr( 'state', 'hidden' );
    return this;
  }
}
