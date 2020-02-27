// eslint-disable-next-line no-unused-vars
//= include ../code/preloader/preloader.js

function showFullName() {
  const res = `${this.firstname} ${this.lastname}`;
  console.log( `Hi, ${res}` );
  return res;
}

function introduce( func, data ) {
  console.log( data );
  console.log( `Hello, ${func.call( data )}` );
}

const data = {
  firstname: 'Black',
  lastname: 'Star'
};

introduce( showFullName, data );
