const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const { format } = require('./config/db.js');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

app.use('/user', userRoutes);                                            
app.use('/products', productRoutes);

const Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API documentation using Swagger.',
      version: '1.0.0',
      description: 'API docs for user auth and product management system',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: [], 
};

const swaggerSpec = swaggerJsDoc(Options);

swaggerSpec.paths = {
  '/user/register': {
    post: {
      summary: 'Register user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string', minLength:3, maxLength:30 },
                lastName: { type: 'string', minLength:3, maxLength:30 },
                email: { type: 'string' ,format: 'email' },
                password: { type: 'string',  minLength:6, maxLength:20 },
                address : { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'User registered' },
        400: { description: 'User already exists' },
      },
    },
  },
  '/user/login': {
    post: {
      summary: 'Login user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Login success' },
        404: { description: 'User not found' },
      },
    },
  },
  '/products/create': {
    post: {
      summary: 'Create product',
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string', minLength:5, maxLength:50 },
                description: { type: 'string',minLength:3, maxLength:100 },
                price: { type: 'string' },
                brand: { type: 'string' },
                image: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Product created' },
        400: { description: 'Duplicate product ID' },
      },
    },
  },
  '/products/list': {
    get: {
      summary: 'Get paginated products',
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer' }, required: false },
        { in: 'query', name: 'search', schema: { type: 'string' }, required: false },
      ],
      responses: {
        200: { description: 'Product list' },
      },
    },
  },
  '/products/{id}': {
    get: {
      summary: 'Get single product',
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Product found' },
        404: { description: 'Not found' },
      },
    },
    put: {
      summary: 'Update product',
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'string' },
                brand: { type: 'string' },
                image: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Product updated' },
      },
    },
    delete: {
      summary: 'Delete product',
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Deleted' },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});

