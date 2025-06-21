import { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import CompanySettings from '../components/CompanySettings';
import Breadcrumbs from '../components/Breadcrumbs';
import { 
  Cog6ToothIcon,
  BuildingOfficeIcon,
  UserIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    {
      id: 'company',
      name: 'Company Information',
      icon: BuildingOfficeIcon,
      description: 'Manage company details for invoices'
    },
    {
      id: 'profile',
      name: 'User Profile',
      icon: UserIcon,
      description: 'Update your account information'
    },
    {
      id: 'security',
      name: 'Security',
      icon: ShieldCheckIcon,
      description: 'Password and security settings'
    },
    {
      id: 'preferences',
      name: 'Preferences',
      icon: Cog6ToothIcon,
      description: 'Application preferences and settings'
    }
  ];

  const breadcrumbItems = [
    { label: 'Settings', href: '/settings' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanySettings />;
      case 'profile':
        return (
          <Card>
            <div className="flex items-center mb-6">
              <UserIcon className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                User Profile
              </h2>
            </div>
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                User profile settings will be implemented in the next version.
              </p>
            </div>
          </Card>
        );
      case 'security':
        return (
          <Card>
            <div className="flex items-center mb-6">
              <ShieldCheckIcon className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Security Settings
              </h2>
            </div>
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Security settings will be implemented in the next version.
              </p>
            </div>
          </Card>
        );
      case 'preferences':
        return (
          <Card>
            <div className="flex items-center mb-6">
              <Cog6ToothIcon className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Application Preferences
              </h2>
            </div>
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Application preferences will be implemented in the next version.
              </p>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your application settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-medium">{tab.name}</div>
                        <div className="text-sm opacity-75">{tab.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
} 