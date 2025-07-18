import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  CalculatorIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  CalculatorIcon as CalculatorIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid
} from '@heroicons/react/24/solid';

const MobileNavigation = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  // تحديد التبويبات حسب دور المستخدم
  const getTabsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', name: 'الرئيسية', icon: HomeIcon, iconSolid: HomeIconSolid },
          { id: 'users', name: 'المستخدمين', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
          { id: 'reports', name: 'التقارير', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
          { id: 'settings', name: 'الإعدادات', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid },
          { id: 'profile', name: 'الملف الشخصي', icon: UserIcon, iconSolid: UserIconSolid }
        ];
      
      case 'notary_head':
        return [
          { id: 'dashboard', name: 'الرئيسية', icon: HomeIcon, iconSolid: HomeIconSolid },
          { id: 'notaries', name: 'الأمناء', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
          { id: 'documents', name: 'الوثائق', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
          { id: 'reports', name: 'التقارير', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
          { id: 'profile', name: 'الملف الشخصي', icon: UserIcon, iconSolid: UserIconSolid }
        ];
      
      case 'notary':
        return [
          { id: 'dashboard', name: 'الرئيسية', icon: HomeIcon, iconSolid: HomeIconSolid },
          { id: 'documents', name: 'وثائقي', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
          { id: 'inheritance', name: 'المواريث', icon: CalculatorIcon, iconSolid: CalculatorIconSolid },
          { id: 'faq', name: 'الأسئلة', icon: QuestionMarkCircleIcon, iconSolid: QuestionMarkCircleIconSolid },
          { id: 'profile', name: 'الملف الشخصي', icon: UserIcon, iconSolid: UserIconSolid }
        ];
      
      default:
        return [
          { id: 'dashboard', name: 'الرئيسية', icon: HomeIcon, iconSolid: HomeIconSolid },
          { id: 'profile', name: 'الملف الشخصي', icon: UserIcon, iconSolid: UserIconSolid }
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 md:hidden" dir="rtl">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = isActive ? tab.iconSolid : tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 min-w-0 flex-1 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium truncate">{tab.name}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;

