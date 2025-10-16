const { app } = require('@azure/functions');
// const paymentstatus = require('./paymentstatus');
app.setup({
    enableHttpStream: true,
});
// app.http('paymentstatus', paymentstatus);