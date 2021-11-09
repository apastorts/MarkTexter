const showdown = require('showdown');
const jetpack = require('fs-jetpack');
const { ipcRenderer, dialog } = require('electron');
const { jsPDF } = require('jspdf');
window.html2canvas = require('html2canvas');

ipcRenderer.on('FILE_OPEN', (event, args) => {
  if(!args.filePaths){
    alert('Your file did not get saved because of an error.');
    return
  }
  const text = jetpack.read(args.filePaths[0], "utf8");
  document.getElementById('inputText').value = text;
  convertMarkdown();
})

ipcRenderer.on('FILE_SAVE', (event, args) => {
  if(!args.filePath){
    alert('Your file did not get saved because of an error.');
    return
  }
    jetpack.write(args.filePath, document.getElementById('inputText').value);
    alert('Your file has been saved.');
})

ipcRenderer.on('FILE_PDF', (event, args) => {
    const pdf = new jsPDF('p', 'pt', 'a4', true);
    const style = `
    <head>
      <style>
        h1{
          line-height: 1.5;
          font-size:20px;
        }
        h2{
          font-size:17px;
        }
        h3{
          font-size:14px;
        }
        div{
          font-size:8px;
          overflow-wrap: break-word;
          hyphens: auto;
          padding: 0em 1em; 
          width: 280px;
        }
      </style>
    </head>
    `;
    var converter = new showdown.Converter({tables: true});
    const html = converter.makeHtml(document.getElementById('inputText').value);
    pdf.html(style + '<body><div>'+ html + '</div></body>', {
      callback: function (pdf, path) {
        pdf.save(path);
      }
    });
})

function convertMarkdown() {
    var converter = new showdown.Converter({tables: true});
    var text = document.getElementById('inputText').value;
    document.getElementById('formatText').innerHTML = converter.makeHtml(text);
}

window.addEventListener("input", convertMarkdown);