import fastify from 'fastify';

const app = fastify()

app.get('/', async (request, reply) => {
  return 'Hi'
})

app.listen({ port: 5000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
