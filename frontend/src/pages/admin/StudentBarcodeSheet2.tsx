import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AdminLayout } from '../../layouts/AdminLayout';
import {
  CheckSquare, Square, Truck, X, Lock, AlertCircle, RefreshCw, Search
} from 'lucide-react';

interface ApplicationOrder {
  _id: string;
  status: string;
  companyStatus?: string;
  createdAt: string;
  candidate?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  job?: {
    _id: string;
    title?: string;
    company?: string;
    location?: string;
  };
  resumeUrl?: string;
  dispatchedByAdmin?: boolean;
}

export const StudentBarcodeSheet2 = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<ApplicationOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ApplicationOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // PIN modal state
  const [pinModal, setPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [dispatching, setDispatching] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/pending-applications');
      const data = res.data || [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (err: any) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchOrders();
  }, [user]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredOrders(orders.filter(o =>
      o.candidate?.firstName?.toLowerCase().includes(q) ||
      o.candidate?.lastName?.toLowerCase().includes(q) ||
      o.candidate?.email?.toLowerCase().includes(q) ||
      o.job?.title?.toLowerCase().includes(q) ||
      o.job?.company?.toLowerCase().includes(q) ||
      o._id.toLowerCase().includes(q)
    ));
  }, [searchQuery, orders]);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const toggleSelectAll = () => {
    if (selected.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredOrders.map(o => o._id)));
    }
  };

  const handleDispatchClick = () => {
    if (selected.size === 0) {
      toast.error('Please select at least one order to dispatch.');
      return;
    }
    setPinInput('');
    setPinModal(true);
  };

  const confirmDispatch = async () => {
    if (!pinInput.trim()) {
      toast.error('Please enter the admin PIN.');
      return;
    }
    setDispatching(true);
    try {
      const ids = Array.from(selected);
      const res = await api.post('/admin/dispatch-orders', {
        pin: pinInput,
        orderIds: ids,
      });
      setPinModal(false);
      setPinInput('');
      toast.success(`✅ ${res.data.successCount} orders dispatched successfully!`);
      if (res.data.errorCount > 0) {
        toast.error(`⚠️ ${res.data.errorCount} orders failed to dispatch.`);
      }
      setSelected(new Set());
      await fetchOrders(); // Refresh list
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Dispatch failed. Please try again.';
      toast.error(`❌ ${msg}`);
    } finally {
      setDispatching(false);
    }
  };

  const allSelected = filteredOrders.length > 0 && selected.size === filteredOrders.length;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Barcode Sheet 2</h1>
            <p className="text-sm text-gray-500 mt-1">
              Select orders and use the Manual Dispatch button to dispatch them instantly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            {/* Manual Dispatch Button – admin only */}
            {user?.role === 'admin' && (
              <button
                onClick={handleDispatchClick}
                disabled={selected.size === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition
                  ${selected.size > 0
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <Truck size={16} />
                Manual Order Dispatch
                {selected.size > 0 && (
                  <span className="bg-white text-green-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                    {selected.size}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name, email, job title..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Summary badges */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
            Total: {orders.length}
          </span>
          <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold">
            Filtered: {filteredOrders.length}
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
            Selected: {selected.size}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-500 text-sm">Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <AlertCircle size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No pending orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 text-center w-10">
                    <button onClick={toggleSelectAll} className="text-gray-500 hover:text-blue-600 transition">
                      {allSelected ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
                    </button>
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-600">Order ID</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Student Name</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Job / Company</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Applied On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(o => (
                  <tr
                    key={o._id}
                    className={`hover:bg-gray-50 transition ${selected.has(o._id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="p-3 text-center">
                      <button onClick={() => toggleSelect(o._id)} className="text-gray-400 hover:text-blue-600 transition">
                        {selected.has(o._id)
                          ? <CheckSquare size={18} className="text-blue-600" />
                          : <Square size={18} />
                        }
                      </button>
                    </td>
                    <td className="p-3 font-mono text-xs text-gray-500">{o._id.slice(-8).toUpperCase()}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      {o.candidate?.firstName || '—'} {o.candidate?.lastName || ''}
                    </td>
                    <td className="p-3 text-gray-500 text-xs">{o.candidate?.email || '—'}</td>
                    <td className="p-3">
                      <div className="font-medium text-gray-700">{o.job?.title || '—'}</div>
                      <div className="text-xs text-gray-400">{o.job?.company || ''}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${o.dispatchedByAdmin
                          ? 'bg-green-100 text-green-700'
                          : o.status === 'applied'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                        {o.dispatchedByAdmin ? '✅ Dispatched' : o.companyStatus || o.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Admin PIN Modal */}
        {pinModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                    <Lock size={18} className="text-green-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Admin Verification</h2>
                </div>
                <button
                  onClick={() => { setPinModal(false); setPinInput(''); }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Enter your admin PIN to dispatch <span className="font-bold text-gray-800">{selected.size}</span> selected order(s).
              </p>

              <input
                type="password"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmDispatch()}
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                placeholder="••••"
                maxLength={8}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => { setPinModal(false); setPinInput(''); }}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDispatch}
                  disabled={dispatching || !pinInput.trim()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition
                    ${dispatching || !pinInput.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {dispatching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Truck size={16} />
                      Dispatch Orders
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentBarcodeSheet2;
