const authRoute = require('./auth.routes');
const UserRoute = require('./user.routes');
const itemRoute = require('./item.routes');
const roleRoute = require('./role.routes');
const app = require('../app');

function appRouter() {
    app.use('/v1/auth', authRoute);
    app.use('/v1/users', UserRoute);
    app.use('/v1/items', itemRoute);
    app.use('/v1/roles', roleRoute);
}

module.exports = appRouter;
