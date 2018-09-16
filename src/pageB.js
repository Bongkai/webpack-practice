import * as _ from 'lodash';

const page = 'subPageB';

if(page === 'subPageA') {
  import(/* webpackChunkName:'subPageA' */'./subPageA.js').then(subPageA=> {
    console.log(subPageA);
  });
} else if(page === 'subPageB') {
  import(/* webpackChunkName:'subPageB' */'./subPageB.js').then(subPageB=> {
    console.log(subPageB);
  });
}

export default 'pageB';