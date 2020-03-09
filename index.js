const app = require('express')();

app.use((req, res, next)=>{
    console.log('one');
    res.code = 200;
    res.body = 'With sending';
    next();
});

// send an error
app.use('/err', (req, res, next)=>{
    console.log('Here is an error.');
    next('(error)');
});

// check useless next('route') and next('router')
app.get('/some/route', (req, res, next)=>{
    console.log('Route where next with \'route\'.');
    // next('router'); // just stop executing with unsending response, which means send an error status 500 (500 - error from server)
    next('route'); // useless since just what it do it miss handler call in one app.method(...)
}, (req, res, next) => {
    console.log('Never see since the middleware before it has a next with route');
    next('router'); // stops
});
app.use((req, res, next)=>{
    console.log('Enough sutable for next with route');
    next();
});
app.get('/some/route', (req, res, next)=>{
    console.log('Get route where should to send a req a fucn with next route.');
    next()
});

// check executing middleware in one handler
app.get('/hmmm', (req, res, next) => {
    res.body += '1';
    next(); // this shit remember what its did and what can do else
    res.body += '3';
    next();
    res.send({
        anotherdata: res.body
    });
}, (req, res, next) => {
    res.body += '2';
}, (req, res, next) => {
    res.body += '7';
});

// check executing middleware in one handler with error handler
app.get('/error', (req, res, next) => {
    console.log('you are in');
    next('Some big ERROR');
    console.log('after error1');
    next();
    console.log('after error2');
}, (req, res, next) => {
    console.log('123456789');
});

// sends a response
app.use((req, res, next)=>{
    console.log('the last one');
    res.body+='\nAnd the last!';
    res.status(res.code).send({
        statusCode: res.code,
        data: res.body
    });
});

// Handle error if in next func passed a error message
app.use((err, req, res, next) => {
    res.status(500).send({err});
});

app.listen(3214, ()=>{
    console.log('Runnig on 3214...');
});
