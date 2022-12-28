
const { response, request, json } = require('express') 
const express = require('express')
const port = 3000
const app = express()
const uuid = require('uuid') 
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if(index < 0){
        return response.status(404).json({ error: "pedido não encontrado"})
    }

    request.orderIndex = index
    request.orderId = id

    next ()
}

const checkOrderMethod = (request, response, next) => {
    const method  = request.route.methods
    const url = request.route.path
    console.log(method, url)

    next ()
}
app.post('/orders', checkOrderMethod, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"

    const orderId= { id: uuid.v4(), order, clientName, price, status }
   
    orders.push(orderId)

    return response.status(201).json(orderId)
})

app.get('/orders', checkOrderMethod, (request, response) =>{
    return response.json(orders)
})

app.put('/orders/:id', checkOrderId, checkOrderMethod, (request, response) => {
    const { order, clientName, price } = request. body
    const id = request.orderId
    const index = request.orderIndex

    const updateOrder = { id, order, clientName, price, status: "Em Preparação" }

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id', checkOrderId, checkOrderMethod, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)
     return response.status(204).json("Pedido deletado")
} )

app.get('/orders/:id',checkOrderId, checkOrderMethod, (request, response) =>{
 const index = request.orderIndex
 const ordersId = orders[index]

    return response.json(ordersId)
})

app.patch('/orders/:id', checkOrderId, checkOrderMethod, (request, response) =>{
    const index = request.orderIndex
    const { id, order, clientName, price } = orders[index]
    let status = orders[index].status
    status = "Pedido Pronto"

    const readyOrder = { id, order, clientName, price, status}
    
    orders[index] = readyOrder

    return response.json(readyOrder)
})



app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})