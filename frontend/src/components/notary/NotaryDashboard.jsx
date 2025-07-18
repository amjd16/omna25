import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import InheritanceCalculator from '../tools/InheritanceCalculator';
import FAQ from '../tools/FAQ';
import MobileNavigation from '../MobileNavigation';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
  UserIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  CalculatorIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const NotaryDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, inheritance, faq
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notary/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentView(tabId);
  };

  // عرض الأدوات المساعدة
  if (currentView === 'inheritance') {
    return (
      <>
        <InheritanceCalculator onBack={() => handleTabChange('dashboard')} />
        <MobileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </>
    );
  }

  if (currentView === 'faq') {
    return (
      <>
        <FAQ onBack={() => handleTabChange('dashboard')} />
        <MobileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const { notary, stats, recent_documents, popular_document_types } = dashboardData;

  const statsCards = [
    {
      title: 'إجمالي الوثائق',
      value: stats.total_documents,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'قيد المراجعة',
      value: stats.pending_documents,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'معتمدة',
      value: stats.approved_documents,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'وثائق اليوم',
      value: stats.today_documents,
      icon: CalendarDaysIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'وثائق الشهر',
      value: stats.this_month_documents,
      icon: ChartBarIcon,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'إجمالي الرسوم',
      value: `${stats.total_revenue.toLocaleString()} ريال`,
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    }
  ];

  const quickActions = [
    {
      title: 'إنشاء وثيقة جديدة',
      description: 'إنشاء وثيقة توثيقية جديدة',
      icon: PlusIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('إنشاء وثيقة جديدة')
    },
    {
      title: 'إدارة الوثائق',
      description: 'عرض وإدارة جميع الوثائق',
      icon: DocumentDuplicateIcon,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('إدارة الوثائق')
    },
    {
      title: 'الملف الشخصي',
      description: 'عرض وتحديث البيانات الشخصية',
      icon: UserIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('الملف الشخصي')
    },
    {
      title: 'حاسبة المواريث',
      description: 'أداة حساب المواريث الشرعية',
      icon: CalculatorIcon,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => setCurrentView('inheritance')
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { text: 'مسودة', class: 'bg-gray-100 text-gray-800' },
      pending: { text: 'قيد المراجعة', class: 'bg-yellow-100 text-yellow-800' },
      approved: { text: 'معتمدة', class: 'bg-green-100 text-green-800' },
      rejected: { text: 'مرفوضة', class: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20 md:pb-0" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                مرحباً، {dashboardData?.notary?.full_name}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 hidden sm:block">
                الأمين الشرعي - {dashboardData?.notary?.geographical_area?.name || 'غير محدد'}
              </p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 space-x-reverse">
              <div className="text-xs md:text-sm text-gray-500 hidden md:block">
                رقم الهوية: {dashboardData?.notary?.id_number}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg md:rounded-xl shadow-sm p-3 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor} mb-2 md:mb-0 self-start`}>
                  <stat.icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.textColor}`} />
                </div>
                <div className="md:mr-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">الإجراءات السريعة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white p-4 rounded-lg transition-colors text-right`}
                  >
                    <div className="flex items-center">
                      <action.icon className="h-6 w-6 ml-3" />
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">الوثائق الأخيرة</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  عرض الكل
                </button>
              </div>
              
              {recent_documents && recent_documents.length > 0 ? (
                <div className="space-y-4">
                  {recent_documents.map((document) => (
                    <div key={document.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{document.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {document.document_type?.name} - رقم: {document.document_number}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(document.created_at).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {getStatusBadge(document.status)}
                          <div className="flex space-x-1 space-x-reverse">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {document.status === 'draft' && (
                              <>
                                <button className="p-1 text-gray-400 hover:text-green-600">
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-red-600">
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد وثائق حتى الآن</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    إنشاء وثيقة جديدة
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Document Types */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">أنواع الوثائق الأكثر استخداماً</h2>
              {popular_document_types && popular_document_types.length > 0 ? (
                <div className="space-y-3">
                  {popular_document_types.map((type, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{type.document_type?.name}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {type.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">لا توجد بيانات كافية</p>
              )}
            </div>

            {/* Tools */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">الأدوات المساعدة</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setCurrentView('inheritance')}
                  className="w-full flex items-center p-3 text-right bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <CalculatorIcon className="h-5 w-5 text-orange-600 ml-3" />
                  <div>
                    <div className="font-medium text-orange-900">حاسبة المواريث</div>
                    <div className="text-xs text-orange-700">حساب المواريث الشرعية</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setCurrentView('faq')}
                  className="w-full flex items-center p-3 text-right bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <QuestionMarkCircleIcon className="h-5 w-5 text-green-600 ml-3" />
                  <div>
                    <div className="font-medium text-green-900">الأسئلة الشائعة</div>
                    <div className="text-xs text-green-700">إجابات للأسئلة المتكررة</div>
                  </div>
                </button>
              </div>
            </div>

            {/* License Info */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-lg font-bold mb-4">معلومات الترخيص</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>رقم الترخيص:</span>
                  <span className="font-medium">{notary?.license_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>تاريخ الإصدار:</span>
                  <span className="font-medium">
                    {notary?.license_issue_date ? 
                      new Date(notary.license_issue_date).toLocaleDateString('ar-SA') : 
                      'غير محدد'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>تاريخ الانتهاء:</span>
                  <span className="font-medium">
                    {notary?.license_expiry_date ? 
                      new Date(notary.license_expiry_date).toLocaleDateString('ar-SA') : 
                      'غير محدد'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default NotaryDashboard;

