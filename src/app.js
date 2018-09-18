import base from './css/base.css';
import common from './css/common.css';

const app = document.getElementById('app');
app.innerHTML = '<div class="' + base.box + '"></div>';

import(/* webpackChunkName:'a' */ './components/a.js').then(a=> {
  console.log(a);
});