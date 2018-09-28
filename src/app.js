import base from './css/base.css';
import common from './css/common.css';
import { componentA } from './components/a.js';
import { a } from './common/util.js';

const app = document.getElementById('app');
// const div = document.createElement('div');
let list = componentA();
// div.className = 'box1';
// app.appendChild(div);
app.appendChild(list);

$('div').addClass('new');

console.log(a());

// const api = 'https://m.weibo.cn/api/comments/show?id=4193586758833502&page=1';
// const api = '/api/comments/show?id=4193586758833502&page=1';
const api = '/comments/show?id=4193586758833502&page=1';

fetch(api).then(res=> {
  return res.json();
}).then(resJson=> {
  console.log(resJson);
});

// renderA();

if(module.hot) {
  // module.hot.accept();
  module.hot.accept('./components/a.js', function() {
    app.removeChild(list);

    const compA = require('./components/a.js').componentA;
    let newList = compA();

    app.appendChild(newList);
    list = newList;
  });
}
