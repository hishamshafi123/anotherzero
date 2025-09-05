import React from 'react';
import { Contact } from '@/types';
import Card from './Card';
import CardHeader from './CardHeader';
import CardTitle from './CardTitle';
import CardContent from './CardContent';
import Badge from './Badge';

interface ContactListProps {
  contacts: Contact[];
  onContactClick?: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onContactClick }) => {
  const getInterestBadgeColor = (interestLevel: string) => {
    switch (interestLevel) {
      case 'interested':
        return 'green';
      case 'not_interested':
        return 'red';
      default:
        return 'slate';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts ({contacts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              onClick={() => onContactClick?.(contact)}
            >
              <div className="flex items-center gap-3">
                {contact.avatar_url && (
                  <img
                    src={contact.avatar_url}
                    alt={contact.name || contact.handle}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">
                    {contact.name || contact.handle}
                    {contact.name && (
                      <span className="text-slate-400 font-normal ml-2">{contact.handle}</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {contact.source} • Last seen {new Date(contact.last_interaction_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge tone={getInterestBadgeColor(contact.interest_level)}>
                      {contact.interest_level.replace('_', ' ')}
                    </Badge>
                    {contact.tags.map((tag, index) => (
                      <Badge key={index} tone="slate" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-slate-400">
                <span className="text-xs">
                  {new Date(contact.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              No contacts found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactList;