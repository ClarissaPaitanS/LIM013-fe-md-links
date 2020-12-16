#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');

program.version('0.0.1');
const mdLinks = require('./md-links.js');

program
  .option('--v, --validate', 'validate link', false)
  .option('--s, --stats', 'statistic', false);

program.parse(process.argv);

const path = program.args[0];

const optionsCli = () => {
  const optionCli = {};
  optionCli.validate = program.validate;
  optionCli.stats = program.stats;
  return optionCli;
};

const cli = () => {
  if (program.validate === true && program.stats === true) {
    mdLinks.mdLinks(path, optionsCli()) //  { validate: true, stats: false }
      .then((results) => { //  --stats ---validate
        console.log(chalk.blue('Total:', results.length));
        console.log(chalk.cyan('Unique:', mdLinks.uniqueLinks(results).length));
        console.log(chalk.magenta('Broken:', mdLinks.brokenLinks(results).length));
      }).catch(console.error);
  } else if (program.stats === true) {
    mdLinks.mdLinks(path, optionsCli())
      .then((results) => { // --stats
        console.log(chalk.blue('Total:', results.length));
        console.log(chalk.cyan('Unique:', mdLinks.uniqueLinks(results).length));
      }).catch(console.error);
  } else if (program.validate) {
    mdLinks.mdLinks(path, optionsCli())
      .then((results) => { // ---validate
        results.forEach((result) => {
          if (result.status >= 400 || result.status === 'Error') {
            console.log(`${chalk.magenta(result.file)}  ${chalk.cyan(result.href)}  ${chalk.red(result.message)}  ${chalk.red(result.status)}  ${chalk.blue(result.text)}`);
          } else {
            console.log(`${chalk.magenta(result.file)}  ${chalk.cyan(result.href)}  ${chalk.green(result.message)}  ${chalk.green(result.status)}  ${chalk.blue(result.text)}`);
          }
        });
      }).catch(console.error);
  } else {
    mdLinks.mdLinks(path, optionsCli())
      .then((results) => { // --- Ninguna opción
        results.forEach((result) => {
          console.log(`${chalk.magenta(result.file)}  ${chalk.cyan(result.href)}  ${chalk.blue(result.text)}`);
        });
      }).catch(console.error);
  }
};

cli();
