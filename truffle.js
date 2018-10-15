module.exports = {
  networks: {
   development: {
      host: 'localhost',
      port: 8545,
      network_id: '5777', // Match any network id
      gas: 3500000,
    }, 
   ropsten: {
      host: 'localhost',
      port: 8545,
      network_id: '3', // Match any network id
      gas: 3500000,
      gasPrice: 50000000000
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
