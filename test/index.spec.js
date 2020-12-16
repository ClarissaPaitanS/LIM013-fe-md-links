const fetchMock = require('node-fetch');

// eslint-disable-next-line global-require
jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());

fetchMock
  .mock('https://nodejs.org/es/about/', 200)
  .mock('https://nodejs.org/api/fs.html', 200)
  .mock('https://www.w3schools.com/nodejs/nodejs_intro.asp', 200)
  .mock('https://www.reddit.com/r/Ai/broken_link_error_code_500_when_you_reply_to_a/', 404);

const {
  fileExists,
  validateAbsolute,
  validateFile,
  pathExtname,
  validateMd,
  extraerAllLinks,
  readDirectory,
  optionsValidate,
  readFiles,
  renderMarked,
} = require('../src/index.js');

const dataLinks = [
  {
    id: '1', href: 'https://nodejs.org/es/about/', text: '01.1 Acerca de Node.js - Documentación oficial', file: 'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md',
  },
  {
    id: '2', href: 'https://nodejs.org/api/fs.html', text: '01.2 Node.js file system - Documentación oficial', file: 'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md',
  },
  {
    id: '3', href: 'https://www.w3schools.com/nodejs/nodejs_intro.asp', text: '01.3 Node.js Introduction', file: 'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md',
  },
  {
    id: '4', href: 'https://www.reddit.com/r/Ai/broken_link_error_code_500_when_you_reply_to_a/', text: '01.4 airbnb', file: 'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md',
  },
];

const dataFiles = [
  'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md',
  'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_02\\test_02_01\\test_02_1.md',
  'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_02\\test_02_01\\test_02_2.md',
  'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_02\\test_02_01\\test_02_3.md',
  'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_02\\test_02_01\\test_02_4.md',
  'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_02\\test_02_1.md',
  'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_02\\test_02_2.md',
  'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_03\\test_03.md',
];

// Validar la ruta
describe('fileExists', () => {
  it('debería ser una función', () => {
    expect(typeof fileExists).toBe('function');
  });

  it('debería retornar true si existe la ruta', () => {
    expect(fileExists('test/test_01/index.js')).toBe(true);
  });

  it('debería retornar false si no existe la ruta', () => {
    expect(fileExists('test/test_01/app.js')).toBe(false);
  });
});

// Verificar si es absoluta.
describe('validateAbsolute', () => {
  it('debería ser una función', () => {
    expect(typeof validateAbsolute).toBe('function');
  });

  it('debería retornar la ruta, si es absoluta', () => {
    expect(validateAbsolute('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\index.js')).toBe('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\index.js');
  });

  it('debería convertir la ruta en absoluta, si no es absoluta', () => {
    expect(validateAbsolute('test/test_01/index.js')).toBe('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\index.js');
  });
});

// Verificar si es archivo.
describe('validateFile', () => {
  it('debería ser una función', () => {
    expect(typeof validateFile).toBe('function');
  });

  it('debería retornar true si es un archivo', () => {
    expect(validateFile('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\index.js')).toBe(true);
  });

  it('debería retornar false si no es un archivo', () => {
    expect(validateFile('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01')).toBe(false);
  });
});

// Obtener la extención del archivo.
describe('pathExtname', () => {
  it('debería ser una función', () => {
    expect(typeof pathExtname).toBe('function');
  });

  it('debería retornar la extención del archivo', () => {
    expect(pathExtname('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\index.js')).toBe('.js');
  });
});

// Validar si archivo es .md
describe('validateMd', () => {
  it('debería ser una función', () => {
    expect(typeof validateMd).toBe('function');
  });

  it('debería retornar false si no es un archivo .md', () => {
    expect(validateMd(pathExtname('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\index.js'))).toBe(false);
  });

  it('debería retornar true si es un archivo .md', () => {
    expect(validateMd(pathExtname('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md'))).toBe(true);
  });
});

// Validar si archivo es .md
describe('readFiles', () => {
  it('debería ser una función', () => {
    expect(typeof readFiles).toBe('function');
  });

  it('debería leer el archivo', () => {
    expect(readFiles('test/test_03/test_03.md')).toEqual('');
  });
});

// Función para extraer Links:
describe('extraerLinks', () => {
  it('debería ser una función', () => {
    expect(typeof extraerAllLinks).toBe('function');
  });

  it('debería retornar la data de los links', () => {
    expect(extraerAllLinks('W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md')).toEqual(dataLinks);
  });
});

// Función para leer directorio:
describe('readDirectory', () => {
  it('debería ser una función', () => {
    expect(typeof readDirectory).toBe('function');
  });
  it('debería retornar Archivos .md encontrados en un Array de objeto', () => {
    expect(readDirectory('W:\\Proyectos_Github\\LIM013-fe-md-links\\test')).toEqual(dataFiles);
  });
});

// Función para extraer Links:
describe('renderMarked ', () => {
  it('debería ser una función', () => {
    expect(typeof renderMarked).toBe('function');
  });
});

const dataLinksOutput = [
  {
    id: '1',
    href: 'https://nodejs.org/es/about/',
    text: '01.1 Acerca de Node.js - Documentación oficial',
    file: 'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md',
    status: 200,
    message: 'OK',
  },
  {
    id: '2',
    href: 'https://nodejs.org/api/fs.html',
    text: '01.2 Node.js file system - Documentación oficial',
    file: 'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md',
    status: 200,
    message: 'OK',
  },
  {
    id: '3',
    href: 'https://www.w3schools.com/nodejs/nodejs_intro.asp',
    text: '01.3 Node.js Introduction',
    file: 'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md',
    status: 200,
    message: 'OK',
  },
  {
    id: '4',
    href: 'https://www.reddit.com/r/Ai/broken_link_error_code_500_when_you_reply_to_a/',
    text: '01.4 airbnb',
    file: 'W:\\Proyectos_Github\\LIM013-fe-md-links\\test\\test_01\\test_01_1.md',
    status: 404,
    message: 'Not Found',
  },
];

// Función para leer directorio:
describe('optionsValidate', () => {
  it('debería ser una función', () => {
    expect(typeof optionsValidate).toBe('function');
  });

  it('debería retornar array validate ', (done) => {
    optionsValidate(dataLinks)
      .then((data) => {
        expect(data).toEqual(dataLinksOutput);
        done();
      });
  });
});
