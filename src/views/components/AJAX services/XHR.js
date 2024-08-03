import { paginate } from '../utils';

function fget(uri, store, limit, currentpage, back){
  const xhr = new XMLHttpRequest();
  xhr.onload=function(){
    if(xhr.status===200){
      const response = JSON.parse(xhr.responseText);
      store.rows = response.rows;
      store.pagination = paginate(response.total, currentpage, limit, 10);//(number of filtered rows, current page, per page, max pages)
    }
  }
  xhr.open('GET', uri, true);
  xhr.send();

  localStorage.setItem('snippet', saveSnippet('', back, uri, store, 'GET', 'Read'));
}

function fpost(uri, body, store, limit, back){
  const xhr = new XMLHttpRequest();
  xhr.onload=function(){
    const response = JSON.parse(xhr.responseText);
    store.rows.unshift({"id":response.newId, "_id":response.newId, "photo":response.photo, "name":body.get("name"), "age":body.get("age")});//FormData object use get
    if(store.rows.length>limit){store.rows.pop();} //remove last row in <table> (respect limit after add)
  }
  xhr.open('POST', uri, true);
  xhr.send(body);

  localStorage.setItem('snippet', saveSnippet('', back, uri, store, 'POST', 'Create'));
}

function fput(method, uri, body, selectedTr, store, back){
  const xhr = new XMLHttpRequest();
  xhr.onload=function(){
    const response = JSON.parse(xhr.responseText);
    store.rows[selectedTr].photo=response.photo; store.rows[selectedTr].name=body.get('name'); store.rows[selectedTr].age=body.get('age');
  }
  xhr.open(method, uri, true);
  xhr.send(body);

  localStorage.setItem('snippet', saveSnippet('', back, uri, store, method, 'Update'));
}

function fdelete(method, uri, store, back){
  const xhr = new XMLHttpRequest();
  xhr.onload=function(){
    const response = JSON.parse(xhr.responseText);
    if(response.length>0)
    { store.rows.push({"id":response[0].id, "_id":response[0]._id, "name":response[0].name, "age":response[0].age, "photo":response[0].photo}) }
  }
  xhr.open(method, uri, true);
  xhr.send();

  localStorage.setItem('snippet', saveSnippet('', back, uri, store, method, 'Delete'));
}



function saveSnippet(_id, back, uri, store, method, action){
  const t = Date.now() - store.time;
  const d = `${store.time.getDate()}/${store.time.getMonth()+1}/${store.time.getFullYear()} ${store.time.getHours()}:${store.time.getMinutes()}:${store.time.getSeconds()}`
  
  let snippet;
  if (action == 'Read'){
    uri = uri.replace('/Mysql','').replace('/Mongoodb','').replace('/Postgresql','')
    snippet = `const xhr = new XMLHttpRequest()
    xhr.onload = function(){ const Result = JSON.parse(xhr.responseText) }
    xhr.open('GET', '${uri}', true)
    xhr.send()`;
  }
  else if (action == 'Create'){
    snippet = `const xhr = new XMLHttpRequest()
    xhr.onload = function(){ const Result = JSON.parse(xhr.responseText) }
    xhr.open('POST', '${uri}', true)
    xhr.send(payload)`;
  }
  else if (action == 'Update'){
    snippet = `const xhr = new XMLHttpRequest()
    xhr.onload = function(){ const Result = JSON.parse(xhr.responseText) }
    xhr.open('${method}', '${uri}', true)
    xhr.send(payload)`;
  }
  else if (action == 'Delete'){
    snippet = `const xhr = new XMLHttpRequest()
    xhr.onload = function(){ const Result = JSON.parse(xhr.responseText) }
    xhr.open('${method}', '${uri.substring(0,uri.indexOf('?'))}`
    if(uri.indexOf('&')!=-1){ snippet += `?_method=DELETE'` } else {snippet += `'`}
    snippet +=`, true)
    xhr.send()`;
  }
  
  return snippet;
  // axios.post('http://localhost:5000/snippet/', {"_id":_id, "snippet":snippet, "back":back, "ajax":'Axios', "uri":uri, "action":action, "db":store.db, "date":d, "time":t, "username":localStorage.getItem('username')});
}

export default {fget, fpost, fput, fdelete}