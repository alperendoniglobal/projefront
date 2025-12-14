'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Search, 
  Eye, 
  Trash2, 
  X, 
  CheckCircle, 
  Clock, 
  User,
  Phone,
  MessageSquare,
  Filter,
  Loader2,
  MailOpen,
  Reply,
  AlertCircle
} from 'lucide-react';
import { contactApi, type Contact } from '@/lib/api';

type FilterType = 'all' | 'unread' | 'read' | 'replied' | 'unreplied';

export default function MesajlarPage() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      let filters: { isRead?: boolean; isReplied?: boolean } = {};
      
      if (filter === 'unread') filters.isRead = false;
      else if (filter === 'read') filters.isRead = true;
      else if (filter === 'replied') filters.isReplied = true;
      else if (filter === 'unreplied') filters.isReplied = false;
      
      const data = await contactApi.getAll(Object.keys(filters).length > 0 ? filters : undefined);
      setMessages(data);
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (message: Contact) => {
    setSelectedMessage(message);
    setAdminNotes(message.adminNotes || '');
    setIsDetailOpen(true);
    
    // Okunmadıysa okundu olarak işaretle
    if (!message.isRead) {
      try {
        const updated = await contactApi.markAsRead(message.id);
        setMessages(prev => prev.map(m => m.id === message.id ? updated : m));
        setSelectedMessage(updated);
      } catch (error) {
        console.error('Okundu işaretlenemedi:', error);
      }
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedMessage(null);
    setAdminNotes('');
  };

  const handleMarkAsReplied = async () => {
    if (!selectedMessage) return;
    
    try {
      setSaving(true);
      const updated = await contactApi.update(selectedMessage.id, {
        isReplied: true,
        adminNotes: adminNotes || undefined,
      });
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? updated : m));
      setSelectedMessage(updated);
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    
    try {
      setSaving(true);
      const updated = await contactApi.update(selectedMessage.id, {
        adminNotes: adminNotes || undefined,
      });
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? updated : m));
      setSelectedMessage(updated);
    } catch (error) {
      console.error('Not kaydetme hatası:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    
    try {
      await contactApi.delete(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        closeDetail();
      }
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Teklif Talebi': return 'bg-green-100 text-green-700';
      case 'İş Birliği': return 'bg-blue-100 text-blue-700';
      case 'Şikayet / Öneri': return 'bg-red-100 text-red-700';
      case 'Genel Bilgi': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Mail size={24} />
            Mesajlar
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount} yeni
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm">İletişim formundan gelen mesajlar</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Mesajlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'Tümü' },
              { value: 'unread', label: 'Okunmamış' },
              { value: 'read', label: 'Okunmuş' },
              { value: 'unreplied', label: 'Yanıtsız' },
              { value: 'replied', label: 'Yanıtlandı' },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as FilterType)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === f.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Mail className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Mesaj bulunamadı</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !message.isRead ? 'bg-primary/5' : ''
                }`}
                onClick={() => openDetail(message)}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    !message.isRead ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getSubjectColor(message.subject)}`}>
                        {message.subject}
                      </span>
                      {message.isReplied && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle size={10} />
                          Yanıtlandı
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.email}</p>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{message.message}</p>
                  </div>
                  
                  {/* Date & Actions */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">{formatDate(message.createdAt)}</p>
                    <div className="flex gap-1 mt-2 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(message);
                        }}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedMessage.name}</h2>
                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <button onClick={closeDetail} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-5">
                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-600">{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Konu</label>
                  <p className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${getSubjectColor(selectedMessage.subject)}`}>
                    {selectedMessage.subject}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Mesaj</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    {selectedMessage.isRead ? (
                      <MailOpen size={16} className="text-green-500" />
                    ) : (
                      <Mail size={16} className="text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">
                      {selectedMessage.isRead ? 'Okundu' : 'Okunmadı'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedMessage.isReplied ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-orange-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {selectedMessage.isReplied ? 'Yanıtlandı' : 'Yanıt bekleniyor'}
                    </span>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Admin Notları</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Bu mesaj hakkında not ekleyin..."
                    rows={3}
                    className="mt-2 w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} className="inline mr-1" />
                  Sil
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Notları Kaydet
                  </button>
                  {!selectedMessage.isReplied && (
                    <button
                      onClick={handleMarkAsReplied}
                      disabled={saving}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <Reply size={16} />
                      Yanıtlandı İşaretle
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

