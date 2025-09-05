'use client';
import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, TrendingUp, Activity, Eye, ExternalLink, Tag } from 'lucide-react';
import { MOCK_CONTACTS, getContactStats } from '@/lib/mock-data';

const INTEREST_COLORS = {
  interested: 'bg-green-100 text-green-800 border-green-200',
  neutral: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  not_interested: 'bg-red-100 text-red-800 border-red-200',
};

const SOURCE_COLORS = {
  instagram: 'bg-purple-100 text-purple-800 border-purple-200',
  facebook: 'bg-blue-100 text-blue-800 border-blue-200',
};

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [interestFilter, setInterestFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  const contactStats = getContactStats();
  
  const filteredContacts = useMemo(() => {
    return MOCK_CONTACTS.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           contact.handle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInterest = interestFilter === 'all' || contact.interest_level === interestFilter;
      const matchesSource = sourceFilter === 'all' || contact.source === sourceFilter;
      
      return matchesSearch && matchesInterest && matchesSource;
    });
  }, [searchTerm, interestFilter, sourceFilter]);
  
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Contacts</h1>
        <p className="text-gray-400 mt-1">Manage your Instagram and Facebook contacts with interest levels</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Contacts</p>
              <p className="text-2xl font-semibold text-white">{contactStats.totalContacts}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Interested</p>
              <p className="text-2xl font-semibold text-white">{contactStats.interestedContacts}</p>
              <p className="text-green-500 text-xs">{Math.round((contactStats.interestedContacts / contactStats.totalContacts) * 100)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Contacts</p>
              <p className="text-2xl font-semibold text-white">{contactStats.activeContacts}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Engagement</p>
              <p className="text-2xl font-semibold text-white">{contactStats.avgEngagement}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts by name or handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Interest Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select 
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Interests</option>
              <option value="interested">Interested</option>
              <option value="neutral">Neutral</option>
              <option value="not_interested">Not Interested</option>
            </select>
          </div>
          
          {/* Source Filter */}
          <div>
            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sources</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Showing {filteredContacts.length} of {MOCK_CONTACTS.length} contacts
          </p>
          
          {selectedContacts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{selectedContacts.length} selected</span>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                Bulk Actions
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Contacts Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-750 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts(filteredContacts.map(c => c.id));
                      } else {
                        setSelectedContacts([]);
                      }
                    }}
                    className="rounded border-gray-600"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Source</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Interest Level</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Engagement</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Last Seen</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => toggleContactSelection(contact.id)}
                      className="rounded border-gray-600"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={contact.avatar_url}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full"
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
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      SOURCE_COLORS[contact.source]
                    }`}>
                      {contact.source === 'instagram' ? 'Instagram' : 'Facebook'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      INTEREST_COLORS[contact.interest_level]
                    }`}>
                      {contact.interest_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-white">{contact.engagement_score}/100</div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${contact.engagement_score}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-300">{formatDate(contact.last_seen_at)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-white transition">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white transition">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white transition">
                        <Tag className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredContacts.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400">No contacts found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      {filteredContacts.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing 1 to {filteredContacts.length} of {filteredContacts.length} results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}