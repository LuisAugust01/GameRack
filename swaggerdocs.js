const swaggerAutogen = require('swagger-autogen')()

const file = './swagger-output.json'

const routes = ['./src/routes/gameRoutes.js','./src/routes/itemRoutes.js','./src/routes/userRoutes.js']

swaggerAutogen(file,routes).then(()=>{
    require('./src/index.js')
})
