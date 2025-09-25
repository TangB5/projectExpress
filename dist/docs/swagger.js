import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Meuble Moderne',
      version: '1.0.0',
      description: 'Documentation de l\'API backend pour le site e-commerce de meubles.'
    },
    servers: [{
      url: 'http://localhost:5000/api',
      description: 'Serveur de développement'
    }, {
      url: 'https://projectnext-eight.vercel.app/api',
      description: 'Serveur de production'
    }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'authToken'
        }
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'L\'ID unique du produit.'
            },
            name: {
              type: 'string',
              description: 'Le nom du produit.'
            },
            category: {
              type: 'string',
              description: 'La catégorie du produit.'
            },
            description: {
              type: 'string',
              description: 'La description du produit.'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Le prix du produit.'
            },
            stock: {
              type: 'number',
              description: 'Le nombre d\'unités en stock.'
            },
            image: {
              type: 'string',
              description: 'L\'URL de l\'image du produit.'
            },
            status: {
              type: 'string',
              description: 'Le statut du stock (ex. "En stock").'
            },
            statusColor: {
              type: 'string',
              description: 'La couleur associée au statut.'
            },
            isPromo: {
              type: 'boolean',
              description: 'Indique si le produit est en promotion.'
            },
            is_new: {
              type: 'boolean',
              description: 'Indique si le produit est nouveau.'
            },
            oldPrice: {
              type: 'number',
              format: 'float',
              description: 'L\'ancien prix si en promotion.',
              nullable: true
            },
            likes: {
              type: 'number',
              description: 'Le nombre de likes du produit.'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du produit.'
            }
          },
          example: {
            _id: '60c72b2f9b1d8e001c8a4d4b',
            name: 'Table en bois massif',
            category: 'Tables',
            description: 'Table en bois de chêne.',
            price: 250.00,
            stock: 25,
            image: 'https://exemple.com/table.jpg',
            status: 'En stock',
            statusColor: 'green',
            isPromo: false,
            is_new: true,
            oldPrice: null,
            likes: 5,
            createdAt: '2023-10-27T10:00:00Z'
          }
        },
        ProductRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Chaise de bureau'
            },
            category: {
              type: 'string',
              example: 'Chaises'
            },
            description: {
              type: 'string',
              example: 'Chaise ergonomique avec support lombaire.'
            },
            price: {
              type: 'number',
              example: 120.50
            },
            stock: {
              type: 'number',
              example: 50
            },
            image: {
              type: 'string',
              example: 'https://cdn.example.com/chaise.jpg'
            },
            status: {
              type: 'string',
              example: 'En stock'
            },
            statusColor: {
              type: 'string',
              example: 'green'
            },
            isPromo: {
              type: 'boolean',
              example: false
            },
            is_new: {
              type: 'boolean',
              example: true
            },
            oldPrice: {
              type: 'number',
              example: null
            },
            likes: {
              type: 'number',
              example: 0
            }
          },
          required: ['name', 'category', 'price', 'stock', 'image']
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID de l\'utilisateur.'
            },
            name: {
              type: 'string',
              description: 'Nom de l\'utilisateur.'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de l\'utilisateur.'
            },
            role: {
              type: 'string',
              description: 'Rôle de l\'utilisateur ("user" ou "admin").'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création de l\'utilisateur.'
            }
          },
          example: {
            _id: '60c72b2f9b1d8e001c8a4d4c',
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            role: 'user',
            createdAt: '2023-10-27T10:00:00Z'
          }
        },
        UserRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Marie Durant'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'marie.durant@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'monMotDePasseSecret123'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            }
          },
          required: ['name', 'email', 'password']
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            roles: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID de la commande.'
            },
            userId: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                }
              }
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string'
                      },
                      name: {
                        type: 'string'
                      },
                      price: {
                        type: 'number'
                      }
                    }
                  },
                  quantity: {
                    type: 'integer'
                  },
                  price: {
                    type: 'number'
                  }
                }
              }
            },
            total: {
              type: 'number'
            },
            status: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          },
          example: {
            _id: '60c72b2f9b1d8e001c8a4d4d',
            userId: {
              _id: '60c72b2f9b1d8e001c8a4d4c',
              name: 'Jean Dupont'
            },
            items: [{
              productId: {
                _id: '60c72b2f9b1d8e001c8a4d4b',
                name: 'Table en bois massif'
              },
              quantity: 1,
              price: 250
            }],
            total: 250,
            status: 'En cours',
            createdAt: '2023-10-27T10:00:00Z'
          }
        },
        OrderRequest: {
          type: 'object',
          properties: {
            userId: {
              type: 'string'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'string'
                  },
                  quantity: {
                    type: 'integer'
                  }
                },
                required: ['productId', 'quantity']
              }
            }
          },
          required: ['userId', 'items']
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;