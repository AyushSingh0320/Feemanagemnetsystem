const { app } = require('@azure/functions');
require('./paymentstatus.js'); 
app.setup({
    enableHttpStream: true,
});
