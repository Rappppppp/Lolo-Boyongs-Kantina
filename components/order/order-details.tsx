'use client';

import { MapPin, Phone, Copy, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface OrderDetailsProps {
  status: string;
}

export default function OrderDetails({ status }: OrderDetailsProps) {
  const [expandedItems, setExpandedItems] = useState(false);

  const items = [
    { name: 'Pad Thai', quantity: 2, price: 5.99, image: '🍜' },
    { name: 'Tom Yum Soup', quantity: 1, price: 3.99, image: '🥘' },
    { name: 'Spring Rolls', quantity: 1, price: 2.99, image: '🥒' }
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 2.00;
  const total = subtotal + delivery;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Delivery address */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Delivery Address</h3>
        <div className="flex gap-3">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-medium text-foreground">123 Main Street, Apt 4B</p>
            <p className="text-sm text-muted-foreground">New York, NY 10001</p>
            <button className="text-primary text-sm font-medium mt-2 hover:underline flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Call
            </button>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8 border-t border-gray-100 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Order Items</h3>
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {items.length} items
          </span>
        </div>

        {/* Items list */}
        <div className="space-y-3 mb-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.image}</span>
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Special instructions */}
        <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg mb-4">
          <p className="text-sm text-orange-900">
            <span className="font-medium">Special instructions:</span> No extra spice, extra sauce on the side
          </p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="border-t border-gray-100 pt-6 space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Delivery Fee</span>
          <span className="text-green-600">+${delivery.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-foreground border-t border-gray-100 pt-3">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment info */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-900">
          <span className="font-medium">✓ Payment Completed</span> via Credit Card
        </p>
      </div>
    </div>
  );
}
