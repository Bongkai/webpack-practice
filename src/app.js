import base from './css/base.css';
import common from './css/common.css';

var app = document.getElementById('app');
var div = document.createElement('div');
div.className = 'smallBox';
app.appendChild(div);

import { a } from './common/util.js';
console.log(a());
