'use client';
import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, TrendingUp, Activity, Download, UserPlus, MoreVertical, Tag, MessageSquare } from 'lucide-react';
import { MOCK_CONTACTS, getContactStats, type Contact } from '@/lib/mock-data';

interface ContactsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

interface ContactFilters {
  interest: string;
  source: string;
  status: string;
  search: string;
  tags: string[];
}

const ContactsPage: React.FC<ContactsPageProps> = ({ searchParams }) => {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [filters, setFilters] = useState<ContactFilters>({
    interest: 'all',
    source: 'all',
    status: 'all',
    search: '',
    tags: []
  });

  const contactStats = getContactStats();

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      if (filters.interest !== 'all' && contact.interest_level !== filters.interest) return false;
      if (filters.source !== 'all' && contact.source !== filters.source) return false;
      if (filters.status !== 'all' && contact.status !== filters.status) return false;
      if (filters.search && !contact.name.toLowerCase().includes(filters.search.toLowerCase()) && 
          !contact.handle.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => contact.tags.includes(tag))) return false;
      return true;
    });
  }, [contacts, filters]);

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const getInterestBadgeColor = (level: string) => {
    switch (level) {
      case 'interested': return 'bg-green-100 text-green-800 border-green-200';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_interested': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
            <p className="text-gray-400">Manage your lead database and track engagement</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              <Download size={18} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <UserPlus size={18} />
              Add Contact
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{contactStats.totalContacts}</div>
            <div className="text-sm text-gray-400">Total Contacts</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{Math.round((contactStats.interestedContacts / contactStats.totalContacts) * 100)}%</div>
            <div className="text-sm text-gray-400">Interested Rate</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{contactStats.activeContacts}</div>
            <div className="text-sm text-gray-400">Active Contacts</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <MessageSquare className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{contactStats.avgEngagement}</div>
            <div className="text-sm text-gray-400">Avg Engagement</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts by name or handle..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select 
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={filters.interest}
              onChange={(e) => setFilters(prev => ({ ...prev, interest: e.target.value }))}
            >
              <option value="all">All Interest Levels</option>
              <option value="interested">Interested</option>
              <option value="neutral">Neutral</option>
              <option value="not_interested">Not Interested</option>
            </select>

            <select 
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={filters.source}
              onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
            >
              <option value="all">All Sources</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>

            <select 
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedContacts.length > 0 && (
        <div className="bg-blue-600 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <span className="text-white">{selectedContacts.length} contact(s) selected</span>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 transition">
                <Tag size={16} />
                Add Tag
              </button>
              <button className="flex items-center gap-2 px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 transition">
                <Download size={16} />
                Export Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">Contact</th>
                <th className="text-left p-4 text-gray-300 font-medium">Source</th>
                <th className="text-left p-4 text-gray-300 font-medium">Interest Level</th>
                <th className="text-left p-4 text-gray-300 font-medium">Engagement</th>
                <th className="text-left p-4 text-gray-300 font-medium">Last Seen</th>
                <th className="text-left p-4 text-gray-300 font-medium">Tags</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={contact.avatar_url} 
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-white">{contact.name}</div>
                        <div className="text-sm text-gray-400">{contact.handle}</div>
                        {contact.location && (
                          <div className="text-xs text-gray-500">{contact.location}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${contact.source === 'instagram' ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
                      <span className="text-sm text-gray-300 capitalize">{contact.source}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getInterestBadgeColor(contact.interest_level)}`}>
                      {contact.interest_level.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-white font-medium">{contact.engagement_score}%</div>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${contact.engagement_score}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {contact.clicks_count} clicks • {contact.campaigns_count} campaigns
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-300">{formatDate(contact.last_seen_at)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="inline-flex px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                          +{contact.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-400">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition border border-gray-700">
            Previous
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition border border-gray-700">
            2
          </button>
          <button className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition border border-gray-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;