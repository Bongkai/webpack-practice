// require.include('./moduleA.js');

import * as _ from 'lodash';

const page = 'subPageA';

if(page === 'subPageA') {
  // require.ensure(['./subPageA.js'], ()=> {
  //   const subPageA = require('./subPageA.js');
  //   console.log(subPageA);
  // }, 'subPageA');
  import(/* webpackChunkName:'subPageA' */'./subPageA.js').then(subPageA=> {
    console.log(subPageA);
  });
} else if(page === 'subPageB') {
  // require.ensure(['./subPageB.js'], ()=> {
  //   const subPageB = require('./subPageB.js');
  //   console.log(subPageB);
  // }, 'subPageB');
  import(/* webpackChunkName:'subPageB' */'./subPageB.js').then(subPageB=> {
    console.log(subPageB);
  });
}

// require.ensure(['lodash'], ()=> {
//   const _ = require('lodash');
//   _.join(['1', '2'], '3');
// }, 'vendor');

export default 'pageA';