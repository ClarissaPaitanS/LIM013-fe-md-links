/* eslint-disable no-return-assign */
/* eslint-disable linebreak-style */
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');
// const FileHound = require('filehound');

const renderer = new marked.Renderer();

// Validar si la ruta existe
const fileExists = (file) => (fs.existsSync(file));

// Validar ruta si esabsoluta, de lo contrario convertirla
const validateAbsolute = (file) => ((path.isAbsolute(file)) ? file : path.resolve(file));

// Verificar si es un archivo.
const validateFile = (file) => fs.statSync(file).isFile();

// Verificar si es un directorio.
const validateDirectory = (file) => fs.statSync(file).isDirectory();

// Obtener la extención del archivo.
const pathExtname = (file) => path.extname(file);

// Verificar si es un archivo .md
const validateMd = (file) => file === '.md';

// Leer archivo.
const readFiles = (file) => fs.readFileSync(file, 'utf-8');
// Html
// const htmlFile = marked('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_02\\test_02_1.md');
// console.log('File en HTML:', htmlFile);

let j = 0;
// render
const renderMarked = (ruta, arraysLinksFile) => {
  // eslint-disable-next-line no-loop-func
  renderer.link = (href, _title, text) => {
    if (href.includes('http')) {
      arraysLinksFile.push({
        id: `${j += 1}`,
        href,
        text,
        file: ruta,
      });
    }
  };
  marked(readFiles(ruta), { renderer });
};

// Extraer los Links:
const extraerAllLinks = (arrayFiles) => {
  const arraysLinksFile = [];
  if (typeof (arrayFiles) === 'object') {
    arrayFiles.forEach((arrayFile) => renderMarked(arrayFile, arraysLinksFile));
  } else {
    renderMarked(arrayFiles, arraysLinksFile);
  }
  return arraysLinksFile;
};
// Leer Directorio y Guardar Archivos .md en un Array
// const readDirectory = (route) => FileHound.create()
//   .paths(route)
//   .ext('.md')
//   .find();
// readDirectory('test/test_02').then(console.log);

const readDirectory = (route, filesDirectorio) => {
  const files = fs.readdirSync(route);
  // console.log(files);
  let arraysOfFiles = filesDirectorio || [];

  files.forEach((file) => {
    const nextPath = path.join(route, file);
    // validar si es directorio:
    if (validateDirectory(nextPath) === true) {
      arraysOfFiles = readDirectory(nextPath, arraysOfFiles);
    } else {
      const pathExt = pathExtname(nextPath);

      if (validateMd(pathExt) === true) {
        arraysOfFiles.push(nextPath);
      }
    }
  });
  return arraysOfFiles;
};

// console.log('Archivos .md Encontrados: ', readDirectory('test'));
const optionsValidate = (arrayAllLinks) => {
  const validateLinks = arrayAllLinks.map((link) => fetch(link.href)
    .then((res) => ({
      id: link.id,
      href: link.href,
      text: link.text,
      file: link.file,
      status: res.status,
      message: res.statusText,
    }))
    .catch(() => ({
      id: link.id,
      href: link.href,
      text: link.text,
      file: link.file,
      status: 'Error',
      message: 'Fail',
    })));
  return Promise.all(validateLinks);
  // .then((results) => {
  //   results.forEach((result) => {
  //     console.log(`${result.status}`);
  //   });
  // });
};

module.exports = {
  fileExists,
  validateAbsolute,
  validateFile,
  pathExtname,
  validateMd,
  readDirectory,
  extraerAllLinks,
  optionsValidate,
  readFiles,
  renderMarked,
};
