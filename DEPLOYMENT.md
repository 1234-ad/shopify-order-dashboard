## Deployment Guide

### Deploy to Heroku

1. **Create Heroku app**
```bash
heroku create your-app-name
```

2. **Add PostgreSQL addon**
```bash
heroku addons:create heroku-postgresql:mini
```

3. **Set environment variables**
```bash
heroku config:set SHOPIFY_API_KEY=your_key
heroku config:set SHOPIFY_API_SECRET=your_secret
heroku config:set SHOPIFY_SCOPES=read_orders,read_products
heroku config:set SHOPIFY_HOST=your-app-name.herokuapp.com
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

5. **Run migrations**
```bash
heroku run npm run db:migrate
```

### Deploy to Railway

1. **Connect GitHub repo**
2. **Add PostgreSQL plugin**
3. **Set environment variables** in Railway dashboard
4. **Deploy automatically** on push

### Deploy to Render

1. **Create new Web Service**
2. **Connect GitHub repo**
3. **Add PostgreSQL database**
4. **Set environment variables**
5. **Deploy**

## Testing

### Test OAuth Flow
1. Visit: `https://your-domain.com/api/auth?shop=your-test-store.myshopify.com`
2. Approve permissions
3. Should redirect back to app

### Test API Endpoints
```bash
# Sync orders
curl -X POST "https://your-domain.com/api/orders/sync?shop=your-store.myshopify.com"

# Get orders
curl "https://your-domain.com/api/orders?shop=your-store.myshopify.com&limit=10"

# Get specific order
curl "https://your-domain.com/api/orders/12345?shop=your-store.myshopify.com"
```