'use strict';

const chalk = require('chalk');
const collapseIotaAmount = require('../utils').collapseIotaAmount;
const isMissingData = require('./validations').isMissingData;
const Promise = require('bluebird'); // For older node systems that don't have promise built in.

let elapsedInterval;

// TODO try this again with the getAccountData command.  For now that is a bit buggy.
// https://github.com/iotaledger/iota.lib.js/pull/16
const setupBalanceCommand = (data, iotajs, vorpal) => {
  vorpal
    .command('balance', 'Gets balance for current seed')
    .action((args, callback) => {
      if (isMissingData(['node', 'seed'])) {
        return callback();
      }

      vorpal.log('One moment while we collect the data.');
      const start = Date.now();
      elapsedInterval = setInterval(() => {
        process.stdout.write(`You've been waiting ${Math.floor((Date.now() - start)/1000)}s\r`);
      });

      new Promise((resolve, reject) => {
        iotajs.api.getNewAddress(data.seed, {returnAll: true}, (err, addresses) => {
          if (err) {
            return reject(err);
          }

          resolve(addresses);
        });
      })
      .then(addresses => new Promise((resolve, reject) => {
        iotajs.api.getBalances(addresses, 100, (err, data) => {
          if (err) {
            return reject(err);
          }

          if (elapsedInterval) {
            clearInterval(elapsedInterval);
            const balance = data.balances.reduce((prev, curr) => prev + parseInt(curr), 0);
            vorpal.log(`Your current balance is ${chalk.yellow(collapseIotaAmount(balance))}ι.\n`);
          }

          resolve();
        });
      }))
      .catch(err => {
        if (elapsedInterval) {
          clearInterval(elapsedInterval);
          vorpal.log(chalk.red(err), '\n');
        }
      })
      .finally(callback);
    })

    .cancel(() => {
      clearInterval(elapsedInterval);
      iotajs.api.interruptAttachingToTangle(() => {});
      vorpal.log(chalk.red('cancelled\n'));
    });
};

module.exports = setupBalanceCommand;
