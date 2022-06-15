class TreeNode {
  constructor(key, value = key, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.children = [];
  }

  get isLeaf() {
    return this.children.length === 0;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
}

class Tree {
  constructor(key, value = key) {
    this.root = new TreeNode(key, value);
  }
}



var tree,childElementToAdd
const button = document.getElementById('button')
const inputElement = document.getElementById("input_file");
inputElement.addEventListener("change", handleFiles);

const fileMessage = document.getElementById("fileMessage");
var file, allEntries, parentExists
async function handleFiles() {
  
  file = this.files[0];
  fileMessage.textContent = file.name
  const reader = new zip.ZipReader(new zip.BlobReader(file));
  allEntries = await reader.getEntries()

  var lastIndex, path
  lastIndex = allEntries[0].filename.lastIndexOf('/')
  if(lastIndex > -1){
    path = allEntries[0].filename.substring(0, lastIndex)
    tree = new Tree(path)
    parentExists = true
  }else {
    tree = new Tree('root')
    parentExists = false
  }
  allEntries.forEach(create)
  const jstree = document.getElementById('jstree')
let childElement
  if(parentExists){
    childElement = document.createElement('li')
childElement.appendChild(document.createTextNode(tree.root.key))
  }
  const elem = createE(tree.root,true)
  childElement.appendChild(elem)
  const childElementToAdd = document.createElement('ul')
  childElementToAdd.append(childElement)
  jstree.appendChild(childElementToAdd)
  treejs()
  button.removeAttribute('hidden')
  
}

function createE(root){
  const element = document.createElement('ul')
  for(var i=0;i<root.children.length;i++){
    const child = document.createElement('li')
    const text = document.createTextNode(root.children[i].key);
    child.appendChild(text);
    if(!root.children[i].isLeaf){
      const elem = createE(root.children[i])
      child.appendChild(elem)
    }
    element.appendChild(child);
  }
  return element
}

function create(entry) {
  const arr = entry.filename.split('/')
  if(entry.directory) arr.pop()
  let newnode = arr.pop()
  parentExists ? arr.shift() : ''
  let node = tree.root

  for(var i=0;i<arr.length;i++){
    node = node.children.find((child) => {
      return child.key===arr[i]
    })
  }
  node.children.push(new TreeNode(newnode,newnode,node))
}


  function treejs() {
    $('#jstree').jstree();
    $('#jstree').on("changed.jstree", async function (e, data) {
      const selected = parseInt(data.selected[0].split('_')[1]) - (parentExists ? 2:1)
      if(selected>=0 && !allEntries[selected].directory){
        const blob = await allEntries[selected].getData(new zip.BlobWriter())
const file = new File([blob], allEntries[selected].filename.split('/').pop())
      download(file)
      }
    });
  }

function download(file) {
  const link = document.createElement('a')
  const url = URL.createObjectURL(file)

  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

async function downloadAll() {
  for(let i=0;i<allEntries.length;i++){
    if(!allEntries[i].directory){
    const blob = await allEntries[i].getData(new zip.BlobWriter())
const file = new File([blob], allEntries[i].filename.split('/').pop())
      download(file)
    }
  }
}
  

  














  
  
  