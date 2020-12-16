/* eslint-disable prefer-promise-reject-errors */
const {
  fileExists,
  validateAbsolute,
  validateFile,
  pathExtname,
  validateMd,
  extraerAllLinks,
  readDirectory,
  optionsValidate,
} = require('./index.js');

const brokenLinks = (validateLinks) => validateLinks.filter((link) => link.status >= 400 || link.status === 'Error').map((link) => link.href);

const uniqueLinks = (validateLinks) => Array.from(new Set(validateLinks.map((link) => link.href)));

// Función mdLinks:
const mdLinks = (pathUser, options) => new Promise((resolve, reject) => {
  // 1. Verificar si existe el path.
  if (fileExists(pathUser) === true) {
    // resolve("La ruta si existe");
    // 2 Verificar si es absoluta - Convertir en absoluta.
    const absolutePath = validateAbsolute(pathUser);

    // 3. Verificar si es archivo
    if (validateFile(absolutePath) === true) {
      const pathExt = pathExtname(absolutePath);

      if (validateMd(pathExt) === true) {
        // resolve('Si es un archivo marckdown (.md)');
        // 4. Leer Archivo - Extraer Links
        // resolve(extraerAllLinks(absolutePath));
        const arrayAllLinks = extraerAllLinks(absolutePath);

        if (options) {
          if (options.validate === true) {
            resolve(optionsValidate(arrayAllLinks));
          } else {
            resolve(arrayAllLinks);
          }
        } else {
          resolve(arrayAllLinks);
        }
      } else {
        reject('No es un archivo marckdown (.md)');
      }
    } else { // 3.1 Si es Directorio:
      // Leer Directorio - Guardar archivos en array.
      // console.log(absolutePath);
      const listFileMd = readDirectory(absolutePath);
      // console.log(listFileMd);
      if (listFileMd.length > 0) {
        // Extraer links del directorio
        const arrayAllLinks = extraerAllLinks(listFileMd);
        if (options) {
          if (options.validate === true) {
            resolve(optionsValidate(arrayAllLinks));
          } else {
            resolve(arrayAllLinks);
          }
        } else {
          resolve(arrayAllLinks);
        }
      } else {
        reject('No Existe ningun archivo .md en el directorio');
        // reject(new Error('No Existe ningun archivo .md en el directorio'));
      }
    }
  } else {
    reject('No Existe la ruta');
  }
});
// .then((links) => {
//   console.log(links);
// })
// .catch(console.error);

// mdLinks('test/test_02/test_02_1.md', { validate: true, stats: true })
//   .then((links) => {
//     console.log(links);
//   })
//   .catch(console.error);

module.exports = {
  mdLinks,
  brokenLinks,
  uniqueLinks,
};
