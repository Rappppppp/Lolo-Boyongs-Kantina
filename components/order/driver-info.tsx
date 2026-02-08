'use client';

import { Order } from '@/app/types/order';
import { Phone, MessageCircle, Star, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

interface OrderProps {
  order: Order
}

export default function DriverInfo({ order }: OrderProps) {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Driver card */}
      {order?.rider ? (
        <>
          <div className="flex items-start justify-between"> 
            <div>
              <h3 className="text-sm text-muted-foreground">Your Rider</h3>
              <p className="text-lg font-semibold text-foreground">{order.rider.first_name} {order.rider.last_name}</p>
            </div>
            {/* <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-semibold text-foreground">4.95</span>
              </div>
              <p className="text-xs text-muted-foreground">1,240 trips</p>
            </div> */}
          </div>

          {/* Driver avatar and stats */}

          {/* Action buttons */}
          {/* <div className="flex gap-3 mb-6">
            <button className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button className="flex-1 bg-gray-100 text-foreground py-3 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          </div> */}

          {/* Live location */}
          {/* <div className="p-4 bg-gradient-to-r from-primary/10 to-orange-100 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">Live Tracking</span>
            </div>
            <div className="w-full h-32 bg-white rounded-lg border border-primary/20 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">📍 Driver location</p>
            </div>
          </div> */}
        </>
      ) : (
        <>
          {/* Pre-delivery state */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl animate-bounce">
              👨‍🍳
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Assigning a Rider</h3>
            <p className="text-sm text-muted-foreground mb-6">
              We're looking for an available driver to pick up your order
            </p>

            {/* Animated dots */}
            <div className="flex justify-center gap-1 mb-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  style={{
                    animation: `bounce 1.4s infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              You'll receive a notification when a driver accepts
            </p>
          </div>
        </>
      )}

      {/* Rating section (shown after delivery) */}
      {/* {isCompleted && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="font-medium text-foreground mb-4">Rate Your Delivery</h4>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? 'fill-primary text-primary' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-center text-primary font-medium">
              Thank you! Your feedback helps us improve
            </p>
          )}
        </div>
      )} */}
    </div>
  );
}
