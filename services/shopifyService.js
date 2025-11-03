const axios = require('axios');

class ShopifyService {
  constructor(shop, accessToken) {
    this.shop = shop;
    this.accessToken = accessToken;
    this.apiVersion = '2024-01';
  }

  async fetchOrders(limit = 250) {
    try {
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      
      const query = `
        query getOrders($first: Int!, $query: String!) {
          orders(first: $first, query: $query) {
            edges {
              node {
                id
                name
                createdAt
                displayFinancialStatus
                displayFulfillmentStatus
                totalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                customer {
                  displayName
                  email
                }
                lineItems(first: 50) {
                  edges {
                    node {
                      id
                      name
                      quantity
                      originalUnitPriceSet {
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      image {
                        url
                        altText
                      }
                      product {
                        id
                        title
                      }
                      variant {
                        id
                        title
                      }
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      const response = await axios.post(
        `https://${this.shop}/admin/api/${this.apiVersion}/graphql.json`,
        {
          query,
          variables: {
            first: limit,
            query: `created_at:>=${sixtyDaysAgo.toISOString()}`
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': this.accessToken
          }
        }
      );

      if (response.data.errors) {
        throw new Error(JSON.stringify(response.data.errors));
      }

      return response.data.data.orders.edges.map(edge => this.formatOrder(edge.node));
    } catch (error) {
      console.error('Error fetching orders from Shopify:', error.message);
      throw error;
    }
  }

  formatOrder(order) {
    return {
      orderId: order.id.split('/').pop(),
      shop: this.shop,
      status: order.displayFulfillmentStatus || order.displayFinancialStatus,
      totalPrice: order.totalPriceSet?.shopMoney?.amount || '0',
      customerName: order.customer?.displayName || 'Guest',
      customerEmail: order.customer?.email || '',
      lineItems: order.lineItems.edges.map(item => ({
        id: item.node.id.split('/').pop(),
        name: item.node.name,
        quantity: item.node.quantity,
        price: item.node.originalUnitPriceSet?.shopMoney?.amount || '0',
        imageUrl: item.node.image?.url || '',
        productId: item.node.product?.id.split('/').pop(),
        variantId: item.node.variant?.id.split('/').pop()
      })),
      createdAt: order.createdAt
    };
  }

  async getOrderById(orderId) {
    try {
      const query = `
        query getOrder($id: ID!) {
          order(id: $id) {
            id
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              displayName
              email
            }
            lineItems(first: 50) {
              edges {
                node {
                  id
                  name
                  quantity
                  originalUnitPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      `;

      const response = await axios.post(
        `https://${this.shop}/admin/api/${this.apiVersion}/graphql.json`,
        {
          query,
          variables: { id: `gid://shopify/Order/${orderId}` }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': this.accessToken
          }
        }
      );

      if (response.data.errors) {
        throw new Error(JSON.stringify(response.data.errors));
      }

      return this.formatOrder(response.data.data.order);
    } catch (error) {
      console.error('Error fetching order from Shopify:', error.message);
      throw error;
    }
  }
}

module.exports = ShopifyService;