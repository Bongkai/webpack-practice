export function renderA() {
  let a = document.getElementById('one');
  a.innerHTML = `
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
  `;
}

export function componentA() {
  let ul = document.createElement('ul');
  ul.innerHTML = `
    <li>1</li>
    <li>2</li>
    <li>3</li>
  `;
  return ul;
}
