import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notaryHeadService } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  MapPinIcon, 
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const NotaryHeadDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await notaryHeadService.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
          <Button onClick={loadDashboardData} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'إجمالي الأمناء',
      value: dashboardData?.stats?.total_notaries || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: `${dashboardData?.stats?.active_notaries || 0} نشط`
    },
    {
      title: 'الوثائق اليوم',
      value: dashboardData?.stats?.today_documents || 0,
      icon: DocumentTextIcon,
      color: 'bg-green-500',
      change: `من ${dashboardData?.stats?.total_documents || 0} إجمالي`
    },
    {
      title: 'المناطق المدارة',
      value: dashboardData?.stats?.areas_count || 0,
      icon: MapPinIcon,
      color: 'bg-purple-500',
      change: 'منطقة'
    },
    {
      title: 'معدل الأداء',
      value: '92%',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  const quickActions = [
    {
      title: 'إضافة أمين جديد',
      description: 'تسجيل أمين شرعي جديد',
      icon: PlusIcon,
      color: 'bg-blue-500',
      href: '/notary-head/notaries/add'
    },
    {
      title: 'إدارة الأمناء',
      description: 'عرض وإدارة الأمناء التابعين',
      icon: UsersIcon,
      color: 'bg-green-500',
      href: '/notary-head/notaries'
    },
    {
      title: 'تقارير الأداء',
      description: 'عرض تقارير أداء الأمناء',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      href: '/notary-head/reports'
    },
    {
      title: 'الوثائق',
      description: 'متابعة الوثائق والمعاملات',
      icon: DocumentTextIcon,
      color: 'bg-orange-500',
      href: '/notary-head/documents'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <h1 className="text-xl font-semibold text-gray-900">نظام إدارة الأمناء</h1>
                <p className="text-sm text-gray-500">لوحة تحكم رئيس قلم التوثيق</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">رئيس قلم التوثيق</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={logout}>
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              مرحباً بك، {user?.username}
            </h2>
            <p className="text-gray-600">
              إليك نظرة عامة على أداء الأمناء التابعين لك والإحصائيات الحديثة
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        الانتقال
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Areas and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Managed Areas */}
            <Card>
              <CardHeader>
                <CardTitle>المناطق المدارة</CardTitle>
                <CardDescription>المناطق الجغرافية التابعة لك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.areas?.map((area, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{area.name}</p>
                          <p className="text-xs text-gray-500">{area.type}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">نشط</span>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">لا توجد مناطق مدارة</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>النشاطات الأخيرة</CardTitle>
                <CardDescription>آخر العمليات في منطقتك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'تم إنشاء وثيقة جديدة', notary: 'أحمد محمد', time: 'منذ 5 دقائق', type: 'success' },
                    { action: 'تم تحديث بيانات أمين', notary: 'فاطمة علي', time: 'منذ 15 دقيقة', type: 'info' },
                    { action: 'تم إضافة أمين جديد', notary: 'محمد سالم', time: 'منذ 30 دقيقة', type: 'success' },
                    { action: 'تم مراجعة وثيقة', notary: 'سارة أحمد', time: 'منذ ساعة', type: 'warning' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'info' ? 'bg-blue-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">بواسطة {activity.notary}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotaryHeadDashboard;

