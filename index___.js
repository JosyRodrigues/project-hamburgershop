const { response, request, json } = require('express') 
const express = require('express') 
const uuid = require('uuid')
const port = 3005
const app = express()
app.use(express.json()) 

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params 

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Pedido não encontrado" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}
const checkOrderMethod = (request, response, next) => {
    const method = request.route.methods
    const url = request.route.path
    console.log(method, url)

    next()
}

app.post('/orders', checkOrderMethod, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"

    const orders = { id: uuid.v4(), order, clientName, price, status }
    orders.push(orders)

    return response.status(201).json(orders)
})

app.get('/orders', checkOrderMethod, (request, response) => {

    return response.json(orders)
})

app.put('/orders/:id', checkOrderId, checkOrderMethod, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"
    const id = request.userId
    const index = request.userIndex

    const newOrder = { id, order, clientName, price, status }

    orders[index] = newOrder

    return response.json(newOrder)

})

app.delete('/orders/:id', checkOrderId, checkOrderMethod, (request, response) => {
    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json(orders)
})
app.get('/orders/:id', checkOrderId, checkOrderMethod, (request, response) => {
    const index = request.userIndex
    const order = orders[index]

    return response.json(orders)
})
app.patch('/orders/:id', checkOrderId, checkOrderMethod, (request, response) => {
    const index = request.userIndex
    const { id, clientName, order, price } = orders[index]
    let status = orders[index].status
    status = "Pedido Pronto"
    const readyOrder = { id, order, clientName, price, status }
    orders[index] = readyOrder

    return response.json(readyOrder)
})


app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})