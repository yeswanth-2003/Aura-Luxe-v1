
import { Product, MetalPrice, ProductWithPrice, MetalType, Order, OrderStatus } from '../types';
import { calculateProductPrice } from '../utils/pricing';

class ProductionAPI {
  async fetcher(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  }

  // Use process.env.API_KEY exclusively as per guidelines
  getApiKey() { return process.env.API_KEY; }

  async getAllProducts(): Promise<ProductWithPrice[]> {
    const products = await this.fetcher('/api/products');
    const prices = await this.getMetalPrices();
    return products.filter((p: Product) => p.isActive).map((p: Product) => {
      const metalPrice = prices.find(m => m.metal === p.metal && m.purity === p.purity) || prices[0];
      return { ...p, pricing: calculateProductPrice(p, metalPrice) };
    });
  }

  async getAdminProducts(): Promise<ProductWithPrice[]> {
    const products = await this.fetcher('/api/products');
    const prices = await this.getMetalPrices();
    return products.map((p: Product) => {
      const metalPrice = prices.find(m => m.metal === p.metal && m.purity === p.purity) || prices[0];
      return { ...p, pricing: calculateProductPrice(p, metalPrice) };
    });
  }

  async getProductById(id: string): Promise<ProductWithPrice | null> {
    const products = await this.fetcher('/api/products');
    const product = products.find((p: any) => (p.id || p._id) === id);
    if (!product) return null;
    const prices = await this.getMetalPrices();
    const metalPrice = prices.find(m => m.metal === product.metal && m.purity === product.purity) || prices[0];
    return { ...product, pricing: calculateProductPrice(product, metalPrice) };
  }

  async updateMetalPrice(metal: MetalType, purity: string, newPrice: number): Promise<void> {
    await this.fetcher('/api/rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metal, purity, pricePerGram: newPrice })
    });
  }

  async getMetalPrices(): Promise<MetalPrice[]> {
    return await this.fetcher('/api/rates');
  }

  async addProduct(productData: any): Promise<Product> {
    return await this.fetcher('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
  }

  // Missing methods for AdminDashboard functionality
  async updateStock(id: string, stock: number): Promise<void> {
    await this.fetcher(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock })
    });
  }

  async toggleProduct(id: string): Promise<void> {
    await this.fetcher(`/api/products/${id}/toggle`, {
      method: 'POST'
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    await this.fetcher(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }

  async placeOrder(orderData: any): Promise<Order> {
    return await this.fetcher('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
  }

  async getOrders(): Promise<Order[]> {
    return await this.fetcher('/api/orders');
  }

  async login(password: string): Promise<string | null> {
    if (password === 'admin123') {
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('aura_admin_token', token);
      return token;
    }
    return null;
  }

  logout() { localStorage.removeItem('aura_admin_token'); }
  isAdmin() { return typeof window !== 'undefined' && !!localStorage.getItem('aura_admin_token'); }
}

export const api = new ProductionAPI();