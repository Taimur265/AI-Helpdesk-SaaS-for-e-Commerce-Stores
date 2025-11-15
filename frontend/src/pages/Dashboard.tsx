import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const response = await api.get('/analytics/overview', {
        params: { storeId: 'store-1' }, // Replace with actual store ID
      });
      return response.data;
    },
  });

  const statCards = [
    {
      name: 'Total Conversations',
      value: stats?.totalConversations || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Open Conversations',
      value: stats?.openConversations || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Resolved',
      value: stats?.resolvedConversations || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Messages',
      value: stats?.totalMessages || 0,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.color} rounded-md p-3`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{card.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to AI Helpdesk</h2>
        <p className="text-gray-600">
          Your AI-powered customer support platform for e-commerce stores. Get started by:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• Connect your Shopify or WooCommerce store</li>
          <li>• Build your knowledge base with FAQs</li>
          <li>• Start handling customer conversations with AI assistance</li>
          <li>• Monitor analytics and response times</li>
        </ul>
      </div>
    </div>
  );
}
