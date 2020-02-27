// eslint-disable-next-line no-unused-vars
const ID = function() {
  return `_${Math.random().toString( 36 ).substr( 2, 9 )}`;
};

function showFullName() {
  const res = `${this.firstname} ${this.lastname}`;
  console.log( `Hi, ${res}` );
  return res;
}

// function showFullName2( obj ) {
//   const res = `${obj.firstname} ${obj.lastname}`;
//   console.log( `Hi, ${res}` );
//   return res;
// }

function introduce( func, data ) {
  console.log( data );
  console.log( `Hello, ${func.call( data )}` );
}

const data = {
  firstname: 'Black',
  lastname: 'Star'
};

introduce( showFullName, data );
