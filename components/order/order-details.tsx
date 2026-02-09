'use client';

import { Home, Mail, MapPin, Notebook, Phone } from 'lucide-react';
import { useState } from 'react';
import { Order } from '@/app/types/order';
import { appConfig } from '@/config/app.config';

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  // const [expandedItems, setExpandedItems] = useState(false);

  // Calculate totals from API data
  const subtotal = order.items_total
  // const delivery = 2.0; // or fetch from API if dynamic
  // const tax =  (subtotal * 1.12) - subtotal // 12% tax//
  const total = subtotal * 1.12 // + delivery;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Delivery address */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Delivery Address</h3>
        <div className="flex gap-3">
          <Home className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            {/* Replace with dynamic address if available */}

            <p className="font-medium text-foreground mb-2"><b>Address: </b>{order.address}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Notebook className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            {/* Replace with dynamic address if available */}

            <p className="font-medium text-foreground"><b>Email: </b>{order.email}</p>
            <p className="text-sm text-muted-foreground">{order.notes && `Notes: ${order.notes}` || 'No delivery notes'}</p>
            <a href={`mailto:${appConfig.email}`} className="text-primary text-sm font-medium mt-2 hover:underline flex items-center gap-1 cursor-pointer">
              <Mail className="w-4 h-4" />
              Need Immediate Notify? Email Customer Admin
            </a>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8 border-t border-gray-100 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Order Items</h3>
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {order.items?.length ?? 0} items
          </span>
        </div>

        {/* Items list */}
        <div className="space-y-3 mb-4">
          {order.items?.map((item) => (
            <div key={item.menu_item_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍽️</span> {/* Could map emojis to menu items */}
                <div>
                  <p className="font-medium text-foreground">{item.menu_item_name}</p>
                  <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-foreground">₱{item.line_total.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Special instructions */}
        {order.notes && (
          <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg mb-4">
            <p className="text-sm text-orange-900">
              <span className="font-medium">Special instructions:</span> {order.notes}
            </p>
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="border-t border-gray-100 pt-6 space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>₱{subtotal?.toFixed(2)}</span>
        </div>
         {/* <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tax (12% vat)</span>
          <span>₱{tax.toFixed(2)}</span>
        </div> */}
        {/* <div className="flex justify-between text-sm text-muted-foreground">
          <span>Delivery Fee</span>
          <span className="text-green-600">+${delivery.toFixed(2)}</span>
        </div> */}
        <div className="flex justify-between text-lg font-bold text-foreground border-t border-gray-100 pt-3">
          <span>Total</span>
          <span className="text-primary">₱{total?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
