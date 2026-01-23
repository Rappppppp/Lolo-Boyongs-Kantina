'use client'

import React, { useEffect, useState } from "react"
import { Clock, ChefHat, Package, Truck, MapPin, CheckCircle2 } from "lucide-react"
import { Order } from "@/app/types/order"

interface StatusStep {
  id: string
  label: string
  description: string
  icon: React.ReactNode
}

interface OrderStatusTrackerProps {
  order: Order
  refreshCount: number
}

export default function OrderStatusTracker({ order, refreshCount }: OrderStatusTrackerProps) {
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)

  const steps: StatusStep[] = [
    { id: "pending", label: "Pending", description: "Waiting for confirmation", icon: <Clock /> },
    { id: "filler1", label: "Confirmed", description: "Order received", icon: <Clock /> },
    { id: "confirmed", label: "Preparing", description: "Being cooked", icon: <ChefHat /> },
    // { id: "ready_pickup", label: "Ready", description: "Waiting for rider", icon: <Package /> },
    { id: "otw", label: "On the Way", description: "Driver is coming", icon: <Truck /> },
    { id: "delivered", label: "Delivered", description: "Order complete", icon: <CheckCircle2 /> },
  ]

  const [prevIndex, setPrevIndex] = useState(0);
  const currentIndex = Math.max(steps.findIndex(s => s.id === order.status), 0);

  useEffect(() => {
    if (prevIndex !== currentIndex) {
      // Animate one step at a time
      const step = prevIndex < currentIndex ? 1 : -1;
      let i = prevIndex;

      const interval = setInterval(() => {
        i += step;
        setAnimatingIndex(i);
        if (i === currentIndex) {
          clearInterval(interval);
          setAnimatingIndex(null);
          setPrevIndex(currentIndex);
        }
      }, 300); // adjust speed of step animation

      return () => clearInterval(interval);
    }
  }, [currentIndex, prevIndex]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border">
      <h2 className="text-xl font-semibold mb-8">Order Status</h2>

      {/* Horizontal Steps */}
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPulse = animatingIndex === index

          return (
            <div key={step.id} className="relative flex-1 flex flex-col items-center text-center">
              {/* Connector */}
              {index !== 0 && (
                <div
                  className={`absolute top-7 -left-1/2 w-full h-1 transition-colors ${isCompleted ? "bg-primary" : "bg-gray-200"
                    }`}
                />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all
                  ${isCompleted || isCurrent ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}
                  ${isCurrent ? "ring-4 ring-primary/30 " : ""}
                  ${isPulse ? "animate-pulse" : ""}
                `}
              >
                {step.icon}
              </div>

              {/* Text */}
              <div className="mt-3">
                <p
                  className={`font-semibold text-sm ${isCompleted || isCurrent ? "text-foreground" : "text-gray-400"
                    }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentIndex + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
