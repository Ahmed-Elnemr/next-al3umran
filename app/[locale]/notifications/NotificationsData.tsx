// components/notifications/NotificationsData.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import apiServiceCall from '../../../src/lib/apiServiceCall';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import notificationImage from '@/public/images/notification.png';

interface Notification {
  id: string;
  data: {
    title: string;
    message: string;
    type: string;
    model_id: number;
  };
  is_read: boolean;
  created_at: string;
}

interface NotificationsDataProps {
  token?: string;
}

const mapNotification = (item: any) => ({
  id: item.id,
  data: {
    title: item.title || item.data?.title?.ar || item.data?.title?.en || item.data?.title || '',
    message: item.body || item.data?.body?.ar || item.data?.body?.en || item.data?.body || item.data?.message || '',
    type: item.type || item.data?.type || '',
    model_id: item.data?.notification_group_id || item.data?.model_id,
  },
  is_read: Boolean(item.is_read ?? item.read_at),
  created_at: item.created_at,
});

const NotificationsData = ({ token }: NotificationsDataProps) => {
  const t = useTranslations('notifications');
  const locale = useLocale();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [modalType, setModalType] = useState<'single' | 'all' | null>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await apiServiceCall({
        method: 'get',
        url: 'client/notifications/unread-count',
        headers: {
          'Accept-Language': locale,
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.data?.unread_count !== undefined) {
        setUnreadCount(res.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async (page: number) => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await apiServiceCall({
        method: 'get',
        url: `client/notifications?page=${page}`,
        headers: {
          'Accept-Language': locale,
          Authorization: `Bearer ${token}`,
        },
      });
      
      const payload = res?.data;
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.notifications?.data)
            ? payload.notifications.data
            : [];
            
      setNotifications(rows.map(mapNotification));

      if (payload?.meta) {
        setCurrentPage(payload.meta.current_page || 1);
        setLastPage(payload.meta.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
    fetchUnreadCount();
  }, [currentPage, token, locale]);

  const markAsRead = async (id: string) => {
    try {
      setIsActionLoading(true);
      await apiServiceCall({
        method: 'post',
        url: `client/notifications/${id}/mark-as-read`,
        headers: {
          'Accept-Language': locale,
          Authorization: `Bearer ${token}`,
        },
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsActionLoading(true);
      await apiServiceCall({
        method: 'post',
        url: 'client/notifications/mark-as-read',
        headers: {
          'Accept-Language': locale,
          Authorization: `Bearer ${token}`,
        },
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedNotificationId(id);
    setModalType('single');
  };

  const handleDeleteAllClick = () => {
    setModalType('all');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedNotificationId(null);
  };

  const confirmDeleteNotification = async () => {
    if (!selectedNotificationId) return;
    
    try {
      setIsActionLoading(true);
      await apiServiceCall({
        method: 'delete',
        url: `client/notifications/${selectedNotificationId}`,
        headers: {
          'Accept-Language': locale,
          Authorization: `Bearer ${token}`,
        },
      });
      
      setNotifications(prev => prev.filter(notif => notif.id !== selectedNotificationId));
      fetchUnreadCount();
      closeModal();
      
      // If we deleted the last one on this page and we are not on page 1, maybe go back
      if (notifications.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmDeleteAllNotifications = async () => {
    try {
      setIsActionLoading(true);
      await apiServiceCall({
        method: 'delete',
        url: 'client/notifications',
        headers: {
          'Accept-Language': locale,
          Authorization: `Bearer ${token}`,
        },
      });
      
      setNotifications([]);
      setUnreadCount(0);
      closeModal();
      setCurrentPage(1);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Title & Badge Header */}
      <div className="text-center mb-10 flex flex-col items-center justify-center">
        <div className="flex items-center gap-3">
          <h2 className="text-primary font-extrabold text-2xl mb-2">{t('title')}</h2>
          {unreadCount > 0 && (
            <div className="bg-red-500 text-white rounded-full px-3 py-0.5 text-sm font-bold shadow-sm animate-pulse mb-2">
              {unreadCount}
            </div>
          )}
        </div>
        <p className="text-gray-600 max-w-lg text-center mx-auto">{t('description')}</p>
      </div>

      {/* Toolbar */}
      {notifications.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/20 rounded-xl">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('notifications_title', { count: notifications.length })}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={isActionLoading}
                  className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50 mt-1 transition-colors"
                >
                  {t('mark_all_read')}
                </button>
              )}
            </div>
          </div>
          
          <button
            onClick={handleDeleteAllClick}
            disabled={isActionLoading || notifications.length === 0}
            className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-all border border-red-100"
          >
            <Trash2 className="w-4 h-4" />
            {t('delete_all')}
          </button>
        </div>
      )}

      {/* Notifications Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {notifications.map((notification) => {
            const isUnread = !notification.is_read;
            return (
              <div
                key={notification.id}
                className={`
                  relative p-5 rounded-2xl border-2 transition-all hover:shadow-lg flex flex-col
                  ${isUnread ? 'border-primary/40 bg-blue-50/40 shadow-sm' : 'border-gray-100 bg-white shadow-sm'}
                `}
              >
                {/* Unread Badge for Item */}
                {isUnread && (
                  <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto">
                    <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {t('new')}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl shrink-0 ${isUnread ? 'bg-primary/20 shadow-inner' : 'bg-gray-50 border border-gray-100'}`}>
                    <Bell className={`w-5 h-5 ${isUnread ? 'text-primary' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0 pr-6 rtl:pr-0 rtl:pl-6">
                    <h4 className={`font-bold truncate text-base ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.data.title}
                    </h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(notification.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-5 flex-1">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {notification.data.message}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-100/80 pt-4 mt-auto">
                  <div className="flex justify-end gap-2">
                    {isUnread && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        disabled={isActionLoading}
                        className="px-4 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {t('mark_as_read')}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(notification.id)}
                      disabled={isActionLoading}
                      className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-lg font-bold flex items-center justify-center transition-colors disabled:opacity-50 border border-gray-100 hover:border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
          <Image
            src={notificationImage}
            alt="notification"
            width={120}
            height={120}
            className="mx-auto mb-6 opacity-80"
          />
          <h4 className="text-xl font-extrabold text-gray-900 mb-2">
            {t('emptyTitle')}
          </h4>
          <p className="text-gray-500 max-w-sm mx-auto">
            {t('emptyDescription')}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {notifications.length > 0 && lastPage > 1 && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
            className="w-10 h-10 rounded-full flex justify-center items-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white shadow-sm transition-all"
          >
            {locale === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => {
              // Simple pagination rendering: show first, last, current, and adjacent
              if (
                p === 1 || 
                p === lastPage || 
                (p >= currentPage - 1 && p <= currentPage + 1)
              ) {
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-full flex justify-center items-center text-sm font-bold transition-all ${
                      currentPage === p 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    {p}
                  </button>
                );
              } else if (
                p === currentPage - 2 || 
                p === currentPage + 2
              ) {
                return <span key={p} className="text-gray-400">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
            disabled={currentPage === lastPage || isLoading}
            className="w-10 h-10 rounded-full flex justify-center items-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white shadow-sm transition-all"
          >
            {locale === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {(modalType === 'single' || modalType === 'all') && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-100 rounded-xl text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    {modalType === 'single' ? t('delete_notification') : t('delete_all_notifications')}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                {modalType === 'single' 
                  ? t('delete_confirmation_single')
                  : t('delete_confirmation_all', { count: notifications.length })
                }
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
                  disabled={isActionLoading}
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={modalType === 'single' ? confirmDeleteNotification : confirmDeleteAllNotifications}
                  disabled={isActionLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isActionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {t('confirm_delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsData;