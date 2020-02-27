/* eslint-disable no-lonely-if */
// eslint-disable-next-line no-unused-vars
class Fixation {
  constructor( data ) {
    this.WINDOW_DOM = $( window );
    this.DOCUMENT = $( document );
    this.container = null;
    this.relBlock_1 = null;
    this.relBlock_2 = null;
    this.fixBlock_1 = null;
    this.fixBlock_2 = null;
    this.btmBlock = null;

    this.relBlock_1 = null;
    this.relBlock_2 = null;

    this._init( data );
  }

  _init( data ) {
    this.container_name = data.block.container;
    this.container = $( this.container_name );
    this.relBlock_1 = data.block.relBlock_1;
    this.relBlock_2 = data.block.relBlock_2;
    this.fixBlock_1 = data.block.fixBlock_1;
    this.fixBlock_2 = data.block.fixBlock_2;
    this.name = data.name ? data.name : 'default';

    this._initBottom();
    this.indent = data.indent;

    this.relBlock_1.addClass( '-relblock-' );
    this.relBlock_2.addClass( '-relblock-' ); // Active elements

    this.draggBlock = null;
    this.fixedBlock = null;
    this.dragParent = null;
    this.winH = 0;
    this.docH = 0;
    this.contrH = 0;
    this.draggH = 0;
    this.dragParentH = 0;
    this.fixedH = 0;
    this.scrollWay = 'default'; // Направление прокрутки

    this.tmpScroll = 0; // Позиция прокрутки

    this.tmpAreaHigher = 0;
    this.tmpIndentTop = 0;
    this.tmpIndentBottom = 0;

    // Define active variables

    this.defineActiveElements();
    this.defineProperties();

    this.turnONScrollFunc();
    this.turnONResizeFunc(); // Action: Resize
  }

  static _setID() {
    return `_${Math.random().toString( 36 ).substr( 2, 9 )}`;
  }

  _initBottom() {
    if ( this.container.children().hasClass( 'bottomEdge' ) ) {
      this.btmBlock = this.container.children( '.bottomEdge' );
      this.bot_id = this.btmBlock.attr( 'scroll_id' );

      if ( !this.bot_id ) {
        this.bot_id = Fixation._setID();
        this.btmBlock.attr( 'scroll_id', this.bot_id );
      }
    }
    else {
      this.btmBlock = document.createElement( 'div' );
      this.btmBlock = $( this.btmBlock );
      this.btmBlock.addClass( 'bottomEdge' );
      this.bot_id = Fixation._setID();
      this.btmBlock.attr( 'scroll_id', this.bot_id );
      this.container.append( this.btmBlock );
    }
  }

  defineActiveElements() {
    if ( this.dragParent !== null ) {
      this._resetToDefault();
    }

    if ( this.fixBlock_1.outerHeight( true ) >= this.fixBlock_2.outerHeight( true ) ) {
      this.draggBlock = this.fixBlock_2;
      this.fixedBlock = this.fixBlock_1;
      this.dragParent = this.relBlock_2;
    }
    else {
      this.draggBlock = this.fixBlock_1;
      this.fixedBlock = this.fixBlock_2;
      this.dragParent = this.relBlock_1;
    }
  }

  defineProperties() {
    this.winH = this.WINDOW_DOM.height();
    this.docH = this.DOCUMENT.height();
    this.contrH = this.container.height();
    this.draggH = this.draggBlock.height();
    this.fixedH = this.fixedBlock.height();
    this.dragParentH = this.dragParent.height();
    this.btmBlockTop = $( `.bottomEdge[scroll_id="${this.bot_id}"]` ).offset().top;
  }

  static _setBlockProps( elem, position ) { // Draw element
    elem.css( 'position', position.position );
    elem.css( 'top', position.top );
    elem.css( 'right', 'auto' );
    elem.css( 'bottom', position.bottom );
    elem.css( 'left', position.left );
    elem.width( elem.parent().width() );
  }

  _setBlockPosition( preway ) {
    const indentTop = this.indent.top ? this.indent.top : 0;
    const indentBottom = this.indent.bottom ? this.indent.bottom : 0;
    this.tmpIndentTop = indentTop;
    this.tmpIndentBottom = indentBottom;


    this.defineProperties();

    if ( this.draggH > this.winH - indentTop - indentBottom && this.draggH > this.fixedH ) { // Если фиксируемый блок больше, чем основное содержимое, то ничего не делаем
      this.dragParent.height( 'initial' ); // (скорее всего меняем движимый и недвижимый блоки местами)
    }
    else { // Иначе задаем родителю высоту, равную основному содержимому
      this.dragParent.height( this.fixedH ); // (тут вроде все ок)
    }

    const scroll = this.WINDOW_DOM.scrollTop(); // позиция прокрутки страницы (ok!)

    // Вычисляем направление прокрутки

    if ( preway ) {
      this.scrollWay = preway;
    }
    else if ( scroll > this.tmpScroll ) {
      this.scrollWay = 'down';
    }
    else {
      this.scrollWay = 'up';
    }

    this.tmpScroll = scroll; // Сохраняем текущую позицию

    this.fixedH = this.fixedBlock.outerHeight( true );
    this.dragParentH = this.dragParent.height();
    this.draggH = this.draggBlock.outerHeight( true ); // Верхняя граница
    const upperBound = this.dragParent.offset().top; // Нижняя граница

    const bottomBound = this.docH - this.winH - ( this.docH - this.btmBlockTop );
    const draggBlockTop = this.draggBlock.offset().top;
    const areaHigher = draggBlockTop - upperBound;
    this.tmpAreaHigher = areaHigher;

    // console.log(`
    //   [${this.name}] preway:${preway}; bottomEdge: ${bottomBound};
    //   winH: ${this.winH}; docH: ${this.docH}; contrH: ${this.contrH};
    //   draggH: ${this.draggH}; fixedH: ${this.fixedH}; dragParentH: ${this.dragParentH};
    // `);
    // console.log(this.dragParent, this.fixedBlock, this.draggBlock)

    let props = {};
    if ( this.draggH < this.winH - indentTop - indentBottom ) { // Если фиксируемый блок целиком помещается на экране,
      // то просто фиксируем его
      if ( scroll <= upperBound - indentTop ) { // Если проскролили до начала родителя и выше, то прикрепляем к верхней границе родителя
        props = {
          position: 'absolute',
          top: 0,
          bottom: 'auto',
          right: 0
        };

        // this._logVariant(0);
      }
      else if ( scroll > upperBound - indentTop && scroll < this.btmBlockTop - this.draggH - indentTop ) { // Блок всегда виден на экране и прекреплен к верхней его части
        props = {
          position: 'fixed',
          top: indentTop,
          bottom: 'auto',
          right: 'auto'
        };

        // this._logVariant(1);
      }
      else { // Если проскролили до конца родителя и ниже, то прикрепляем фиксированный блок к нижней границе родителя
        props = {
          position: 'absolute',
          top: 'auto',
          bottom: 0,
          right: 0
        };

        // this._logVariant(2);
      }
    }
    else if ( this.draggH > this.winH - indentTop - indentBottom && this.draggH < this.fixedH ) { // Если фиксируемый блок не помещается на экране
      // и он меньше основного содержимого
      if ( this.scrollWay === 'down' ) { // Если скроллим страницу вниз
        if ( scroll < this.draggH - 10 - this.winH + upperBound + areaHigher ) { // где-то в пути при смене направления прокрутки
          props = {
            position: 'absolute',
            top: areaHigher,
            bottom: 'auto',
            right: 0
          };

          // this._logVariant(3);
        }
        else { // Если проскролили фиксированный блок до конца, то прикрепляем его к нижней границе экрана
          props = {
            position: 'fixed',
            top: 'auto',
            bottom: indentBottom,
            right: 'auto'
          };

          // this._logVariant(4);
        }

        if ( scroll > bottomBound ) { // Если проскролили до конца родителя и ниже, то прикрепляем фиксированный блок к нижней границе родителя
          props = {
            position: 'absolute',
            top: 'auto',
            bottom: 0,
            right: 0
          };

          // this._logVariant(5);
        }
      }
      else { // Если скроллим страницу вверх
        if ( scroll > upperBound - indentTop && scroll <= draggBlockTop - indentTop ) { // Пока не проскролили до верхней границы родителя прикрепляем фиксированный блок к верхней границе экрана
          props = {
            position: 'fixed',
            top: indentTop,
            bottom: 'auto',
            right: 'auto'
          };

          // this._logVariant(6);
        }
        else if ( scroll <= upperBound - indentTop ) { // Если проскролили до начала родителя и выше, то прикрепляем к верхней границе родителя
          props = {
            position: 'absolute',
            top: 0,
            bottom: 'auto',
            right: 0
          };

          // this._logVariant(7);
        }
        else { // где-то в пути при смене направления прокрутки
          props = {
            position: 'absolute',
            top: areaHigher,
            bottom: 'auto',
            right: 0
          };

          // this._logVariant(9);
        }
      }
    }
    else { // В случае, если фиксируемый блок не момещается на экране
      // и он больше основного содержимого,
      // то ичего не делаем с блоком
      props = {
        position: 'initial'
      };

      // this._logVariant(10);
    }

    Fixation._setBlockProps( this.draggBlock, props );
  }


  _resetToDefault() {
    this.dragParent.css( 'height', 'auto' );
    this.draggBlock.css( 'position', 'initial' );
    this.draggBlock.css( 'top', 'initial' );
    this.draggBlock.css( 'right', 'initial' );
    this.draggBlock.css( 'bottom', 'initial' );
    this.draggBlock.css( 'left', 'initial' );
  }

  turnONScrollFunc() {
    this.WINDOW_DOM.on( `scroll.${this.bot_id}`, () => {
      this._setBlockPosition( false );
    } );
  }

  _logVariant( variant ) {
    if ( this.name === 'left' || this.name === 'right' ) {
      console.log( `[${this.name}] ${variant}` );
    }
  }

  turnOFFScrollFunc() {
    this.WINDOW_DOM.off( `scroll.${this.bot_id}` );

    // console.log(`detach scroll.${this.bot_id}`)
  }

  turnONResizeFunc() {
    this.WINDOW_DOM.on( `resize.${this.bot_id}`, () => {
      this._resizeFunc();
    } );
  }

  turnOFFResizeFunc() {
    this.WINDOW_DOM.off( `resize.${this.bot_id}` );

    // console.log(`detach resize.${this.bot_id}`)
  }

  _resizeFunc() {
    this.defineActiveElements();
    this._setBlockPosition( 'down' );
  }

  setPosition() {
    this._setBlockPositionByNewData();
  }
}
