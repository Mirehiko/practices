/* eslint-disable consistent-return */
const http = require( 'http' );

const port = 3000;
const requestHandler = ( request, response ) => {
  console.log( 'request.url', request.url );
  response.end( 'Success!' );
};
const server = http.createServer( requestHandler );
server.listen( port, ( err ) => {
  if ( err ) {
    return console.log( 'something bad happened', err );
  }
  console.log( `server is listening on ${port}` );
} );
