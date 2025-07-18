import React, { useState } from 'react';
import {
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  ScaleIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const FAQ = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const categories = [
    { id: 'all', name: 'جميع الأسئلة', icon: BookOpenIcon },
    { id: 'documents', name: 'الوثائق والعقود', icon: DocumentTextIcon },
    { id: 'inheritance', name: 'المواريث', icon: UserGroupIcon },
    { id: 'legal', name: 'الأحكام الشرعية', icon: ScaleIcon },
    { id: 'procedures', name: 'الإجراءات', icon: QuestionMarkCircleIcon }
  ];

  const faqData = [
    {
      id: 1,
      category: 'documents',
      question: 'ما هي الوثائق المطلوبة لعقد البيع؟',
      answer: 'الوثائق المطلوبة لعقد البيع تشمل: صك الملكية الأصلي، هوية البائع والمشتري، شهادة عدم الممانعة من البلدية، تقييم عقاري معتمد، وإثبات سداد الرسوم والضرائب المستحقة.'
    },
    {
      id: 2,
      category: 'documents',
      question: 'كيف يتم توثيق الوكالة العامة؟',
      answer: 'يتم توثيق الوكالة العامة بحضور الموكل شخصياً مع هويته الأصلية، وتحديد صلاحيات الوكيل بوضوح، وحضور شاهدين، ودفع الرسوم المقررة. يجب أن تكون الوكالة محددة المدة والغرض.'
    },
    {
      id: 3,
      category: 'inheritance',
      question: 'كيف يتم حساب نصيب الزوجة في الميراث؟',
      answer: 'نصيب الزوجة في الميراث: الثُمن (1/8) إذا كان للمتوفى أولاد (ذكور أو إناث)، والربع (1/4) إذا لم يكن له أولاد. هذا النصيب مقدر شرعاً ولا يجوز الاتفاق على تغييره.'
    },
    {
      id: 4,
      category: 'inheritance',
      question: 'هل يحق للمرأة أن ترث من والدها؟',
      answer: 'نعم، المرأة ترث من والدها حسب الشريعة الإسلامية. البنت الواحدة ترث النصف، والبنتان فأكثر يرثن الثلثين، وإذا كان معهن أخ ذكر فللذكر مثل حظ الأنثيين.'
    },
    {
      id: 5,
      category: 'legal',
      question: 'ما هي شروط صحة عقد الزواج؟',
      answer: 'شروط صحة عقد الزواج: رضا الطرفين، وجود الولي للمرأة، حضور شاهدين عدلين، تحديد المهر، عدم وجود موانع شرعية للزواج، وإعلان العقد.'
    },
    {
      id: 6,
      category: 'legal',
      question: 'متى يجوز الطلاق شرعاً؟',
      answer: 'الطلاق مباح شرعاً عند الحاجة، ولكن يُستحب محاولة الإصلاح أولاً. يجب أن يكون الطلاق في طهر لم يجامعها فيه، ويُنصح بوجود شهود وتوثيق الطلاق رسمياً.'
    },
    {
      id: 7,
      category: 'procedures',
      question: 'كم تستغرق عملية توثيق العقد؟',
      answer: 'عملية توثيق العقد تستغرق عادة من 30 دقيقة إلى ساعة واحدة، حسب نوع العقد وتعقيد البنود. العقود البسيطة مثل الإقرارات تستغرق وقتاً أقل، بينما عقود البيع والوكالات تحتاج وقتاً أطول.'
    },
    {
      id: 8,
      category: 'procedures',
      question: 'ما هي رسوم التوثيق؟',
      answer: 'رسوم التوثيق تختلف حسب نوع الوثيقة: عقد البيع (1000 ريال)، الوكالة العامة (500 ريال)، الوكالة الخاصة (300 ريال)، الإقرار (200 ريال)، عقد الزواج (800 ريال). قد تختلف الرسوم حسب قيمة المعاملة.'
    },
    {
      id: 9,
      category: 'documents',
      question: 'هل يمكن تعديل العقد بعد التوثيق؟',
      answer: 'لا يمكن تعديل العقد بعد التوثيق إلا بموافقة جميع الأطراف وإنشاء ملحق أو عقد جديد. أي تعديل يجب أن يتم بنفس الإجراءات الرسمية للعقد الأصلي.'
    },
    {
      id: 10,
      category: 'legal',
      question: 'ما هي أحكام الوصية في الشريعة؟',
      answer: 'الوصية لا تجوز إلا في حدود الثلث من التركة، ولا تجوز للوارث إلا بموافقة باقي الورثة. يجب أن تكون الوصية مكتوبة وموثقة، ويُستحب الإشهاد عليها.'
    },
    {
      id: 11,
      category: 'inheritance',
      question: 'كيف يتم تقسيم الميراث عند وجود ديون؟',
      answer: 'عند وجود ديون، يتم سدادها أولاً من التركة قبل التقسيم، ثم تُخرج تكاليف الجنازة، ثم الوصية (في حدود الثلث)، وما تبقى يُقسم على الورثة حسب أنصبتهم الشرعية.'
    },
    {
      id: 12,
      category: 'procedures',
      question: 'هل يمكن التوثيق بدون حضور أحد الأطراف؟',
      answer: 'لا يمكن التوثيق بدون حضور جميع الأطراف شخصياً، إلا في حالة وجود وكالة صحيحة ومعتمدة. الوكيل يجب أن يحضر الوكالة الأصلية وهويته الشخصية.'
    }
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {onBack && (
                <button
                  onClick={onBack}
                  className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              )}
              <QuestionMarkCircleIcon className="h-8 w-8 text-green-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">الأسئلة الشائعة</h1>
                <p className="text-gray-600">إجابات للأسئلة المتكررة حول التوثيق والأحكام الشرعية</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في الأسئلة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                  }`}
                >
                  <category.icon className="h-4 w-4 ml-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full px-6 py-4 text-right hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.question}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        item.category === 'documents' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'inheritance' ? 'bg-purple-100 text-purple-800' :
                        item.category === 'legal' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {categories.find(c => c.id === item.category)?.name}
                      </span>
                    </div>
                    <div className="mr-4">
                      {expandedItems.has(item.id) ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>
                
                {expandedItems.has(item.id) && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed pt-4">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <QuestionMarkCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600">لم يتم العثور على أسئلة تطابق بحثك. جرب كلمات مختلفة أو اختر فئة أخرى.</p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">لم تجد إجابة لسؤالك؟</h2>
            <p className="mb-4 opacity-90">
              يمكنك التواصل مع الأمين الشرعي أو رئيس قلم التوثيق للحصول على إجابات مفصلة
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                تواصل مع الأمين
              </button>
              <button className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors">
                إرسال استفسار
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">نصائح مهمة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg ml-3">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">احضر الوثائق الأصلية</h3>
                <p className="text-sm text-gray-600">تأكد من إحضار جميع الوثائق الأصلية المطلوبة لتجنب التأخير</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg ml-3">
                <UserGroupIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">حضور جميع الأطراف</h3>
                <p className="text-sm text-gray-600">يجب حضور جميع أطراف العقد شخصياً أو بوكالة معتمدة</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg ml-3">
                <ScaleIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">استشر في الحالات المعقدة</h3>
                <p className="text-sm text-gray-600">للحالات المعقدة، استشر عالماً شرعياً متخصصاً</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-lg ml-3">
                <QuestionMarkCircleIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">اسأل قبل التوقيع</h3>
                <p className="text-sm text-gray-600">لا تتردد في طرح أي أسئلة قبل توقيع العقد</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

