const Web3 = require('web3');
const fs = require('fs')

var WSWEB3 = 'ws://localhost:8546'  // WebSocket endpoint for the RPC server

var web3 = new Web3(Web3.givenProvider || WSWEB3);

endblock = await web3.eth.getBlockNumber()
startBlock = endblock - 1000;
var minerMap = new Map();

async function main(){

    for (let i = startBlock; i<endblock ; i++) {
        var blockObject = web3.eth.getBlock(i);
        var allTransactions = blockObject.transactions;
        for (let j = 0; j < allTransactions.length; j++) {
            var transaction = allTransactions[j];
            var transactionObject = web3.eth.getTransaction(transaction);
            var txPrice = transactionObject.gasPrice;
            var miner = blockObject.miner;
            if(txPrice<30000000000){
                if(minerMap.has(miner)){
                    minerMap.set(miner, minerMap.get(miner) + 1);
                }else{
                    minerMap.set(miner,1);
                }
            }
        }
        
    }

    let now = Math.floor(new Date().getTime() / 1000)

    fs.appendFile(`./output/out-${now}.csv`, `validator, txLessThan30Gwei` , function (err) {
        if (err) throw err;
        console.log('Created output file : ' + `./output/out-${now}.csv`);
    });

    for (var [key, value] of Object.entries(validators)) {
        fs.appendFile(`./output/out-${now}.csv`, `\n${key}, ${value}` , function (err) {
            if (err) throw err;
            console.log('Added to outputFile');
        });
    }

    const timer = ms => new Promise(res => setTimeout(res, ms))

    await timer(3000)

    process.exit(0)

}

main()
