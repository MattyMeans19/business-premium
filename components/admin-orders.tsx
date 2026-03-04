'use client';

import { GetOrderItems } from "@/app/(admin)/actions";
import { useEffect, useState } from "react";

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: Date;
  status?: string;
}

interface Items {
    productName: string,
    quantity: number
}

export default function AdminOrders({ orders }: { orders: Order[] }) {
  const [localOrders, setLocalOrders] = useState<Order[]>(orders || []);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // State for Modal
  const [orderItems, setOrderItems] = useState<Items[] | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null } | null>(null);

  useEffect(() =>{
    if(selectedOrder !== null && orderItems === null){
        GetItems(selectedOrder.id)
    }
  }, )

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function markFulfilled(orderId: number) {
    try {
      const { MarkOrderFulfilled } = await import("@/app/(admin)/actions");
      const res = await MarkOrderFulfilled(orderId);
      if (res?.success) {
        setLocalOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'fulfilled' } : o)));
        // Update the modal view if it's open
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: 'fulfilled' } : null);
        }
        showToast(`Order #${orderId} marked fulfilled`, 'success');
      } else {
        showToast('Failed to mark order fulfilled', 'error');
      }
    } catch (err) {
      showToast('Error marking order fulfilled', 'error');
    }
  }

    async function GetItems(id: number) {
        console.log(selectedOrder)
    if (!selectedOrder) return;
    const itemRequest = await GetOrderItems(id);
    console.log(itemRequest)
    if (itemRequest.success && itemRequest.items !== null) {
        setOrderItems(itemRequest.items)
    } else {
        alert("There was an error!");
    }
    }

  return (
    <div className="ConsoleBox col-span-full">
      <h2 className="text-2xl text-center mb-4 font-bold">Recent Orders</h2>
      
      {localOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No orders</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-right p-3">Total</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Status</th>
                <th className="text-center p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {localOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => {setSelectedOrder(order); GetItems(order.id)}} // Open Modal on row click
                >
                  <td className="p-3 font-semibold text-blue-600">#{order.id}</td>
                  <td className="p-3">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="p-3 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                    {order.status !== 'fulfilled' && (
                      <button
                        onClick={() => markFulfilled(order.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                      >
                        Mark Fulfilled
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 border-b pb-4">Order Details #{selectedOrder.id}</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Customer</h4>
                  <p className="font-medium text-lg">{selectedOrder.customerName}</p>
                  <p className="text-gray-600">{selectedOrder.customerEmail}</p>
                  <p className="text-gray-600">{selectedOrder.customerPhone || 'No phone provided'}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Order Info</h4>
                  <p className="text-gray-600 italic">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${selectedOrder.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      STATUS: {selectedOrder.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border mb-6">
                <h4 className="font-bold mb-3 border-b pb-2">Financial Summary</h4>
                <span className="font-bold underline">Items</span>
                {orderItems?.map((item, index) =>(
                    <div key={index} className="grid grid-cols-2">
                        <p className="col-span-1 font-bold">{item.productName}</p>
                        <p className="col-span-1"><strong>Quantity: </strong>{item.quantity}</p>
                    </div>
                ))}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${selectedOrder.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedOrder.status !== 'fulfilled' && (
                  <button 
                    onClick={() => markFulfilled(selectedOrder.id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Fulfilled
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TOAST --- */}
      {toast && (
        <div className="fixed right-6 bottom-6 z-70 animate-in slide-in-from-right-full">
          <div className={`px-4 py-2 rounded shadow-lg font-medium ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}