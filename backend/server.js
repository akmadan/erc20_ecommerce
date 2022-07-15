const koa = require('koa'); 
const router = require('@koa/router')
const cors = require('@koa/cors'); 
const ethers = require('ethers');
const PaymentProcessor = require('../build/contracts/PaymentProcessor.json'); 
const Payment = require('./db')


const app = new koa(); 
const Router = new router(); 

const items = {
    '1': {id: 1, url: 'http://urlToDownloadItem1'}, 
    '2': {id: 2, url: 'http://urlToDownloadItem2'},
}

Router.get('/api/getPaymentId/:itemId', async ctx => { 
    const paymentId = (Math.random() * 10000).toFixed(0); 
    await Payment.create({
        id: paymentId,
        itemId: ctx.params.itemId,
        paid: false
    });
    ctx.body = { 
        paymentId
    }
})

Router.get('/api/getItemUrl/:paymentId', async ctx => { 
    const payment = await Payment.findOne({id: ctx.params.paymentId}); 
    if(payment && payment.paid == true){
        ctx.body = { 
            url: items[payment.itemId].url
        } 

    }

    else{ 
        ctx.body = { 
            url: ''
        }
    }
})


app.use(cors()); 
app.use(Router.routes()); 
app.use(Router.allowedMethods()); 

app.listen(4000, ()=>{ 
    console.log('Server is listening');
})

const listenToEvents = () => { 
    const provider = ethers.providers.JsonRpcProvider('http://localhost:9545'); 
    const networkId = 5777; 

    const paymentProcessor = ethers.Contract(
        PaymentProcessor.networks[networkId].address, 
        PaymentProcessor.abi,
        provider
        );

    paymentProcessor.on('PaymentDone', async(payer, amount, date, paymentId )=>{ 
        console.log(
            `payer ${payer}
            amount ${amount} 
            paymentId ${paymentId}
            date ${new Date(date.toNumber * 1000).toLocaleString()}`
        
        );

        const payment = Payment.findOne({id: paymentId});
        if(payment){ 
            payment.paid = true; 
            await payment.save();
        }

    });

   


}

