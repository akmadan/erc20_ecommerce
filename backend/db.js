const mongoose = require('mongoose'); 


mongoose.connect(
    'mongodb+srv://akshit:akshit12@cluster0.ljj6u0k.mongodb.net/?retryWrites=true&w=majority', 
    {useNewUrlParser: true, 
    useUnifiedTopology: true}
);

const PaymentSchema = new mongoose.Schema({
    id: String, 
    itemId: String, 
    paid: Boolean
});

// const Payment = new mongoose.model('Payment', PaymentSchema);
const Payment = new mongoose.model('Payment', PaymentSchema);  



module.exports = {Payment};