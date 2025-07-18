import React, { useState } from 'react';
import {
  CalculatorIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const InheritanceCalculator = ({ onBack }) => {
  const [estate, setEstate] = useState({
    totalAmount: '',
    debts: '',
    funeralCosts: '',
    will: ''
  });

  const [heirs, setHeirs] = useState([]);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // قائمة الورثة المحتملين
  const heirTypes = [
    { id: 'husband', name: 'الزوج', gender: 'male' },
    { id: 'wife', name: 'الزوجة', gender: 'female' },
    { id: 'father', name: 'الأب', gender: 'male' },
    { id: 'mother', name: 'الأم', gender: 'female' },
    { id: 'son', name: 'الابن', gender: 'male' },
    { id: 'daughter', name: 'البنت', gender: 'female' },
    { id: 'brother', name: 'الأخ الشقيق', gender: 'male' },
    { id: 'sister', name: 'الأخت الشقيقة', gender: 'female' },
    { id: 'paternal_brother', name: 'الأخ لأب', gender: 'male' },
    { id: 'paternal_sister', name: 'الأخت لأب', gender: 'female' },
    { id: 'maternal_brother', name: 'الأخ لأم', gender: 'male' },
    { id: 'maternal_sister', name: 'الأخت لأم', gender: 'female' },
    { id: 'paternal_grandfather', name: 'الجد لأب', gender: 'male' },
    { id: 'paternal_grandmother', name: 'الجدة لأب', gender: 'female' },
    { id: 'maternal_grandmother', name: 'الجدة لأم', gender: 'female' },
    { id: 'grandson', name: 'ابن الابن', gender: 'male' },
    { id: 'granddaughter', name: 'بنت الابن', gender: 'female' },
    { id: 'uncle', name: 'العم', gender: 'male' },
    { id: 'nephew', name: 'ابن الأخ', gender: 'male' }
  ];

  const addHeir = (heirType) => {
    const existingHeir = heirs.find(h => h.type === heirType.id);
    if (existingHeir) {
      // زيادة العدد إذا كان الوارث موجود
      setHeirs(heirs.map(h => 
        h.type === heirType.id 
          ? { ...h, count: h.count + 1 }
          : h
      ));
    } else {
      // إضافة وارث جديد
      setHeirs([...heirs, {
        type: heirType.id,
        name: heirType.name,
        gender: heirType.gender,
        count: 1
      }]);
    }
  };

  const removeHeir = (heirType) => {
    const existingHeir = heirs.find(h => h.type === heirType);
    if (existingHeir && existingHeir.count > 1) {
      // تقليل العدد
      setHeirs(heirs.map(h => 
        h.type === heirType 
          ? { ...h, count: h.count - 1 }
          : h
      ));
    } else {
      // حذف الوارث
      setHeirs(heirs.filter(h => h.type !== heirType));
    }
  };

  const calculateInheritance = () => {
    const totalAmount = parseFloat(estate.totalAmount) || 0;
    const debts = parseFloat(estate.debts) || 0;
    const funeralCosts = parseFloat(estate.funeralCosts) || 0;
    const will = parseFloat(estate.will) || 0;

    // حساب صافي التركة
    const netEstate = totalAmount - debts - funeralCosts - will;

    if (netEstate <= 0) {
      alert('صافي التركة يجب أن يكون أكبر من الصفر');
      return;
    }

    // حساب الأنصبة الشرعية (مبسط)
    const inheritanceShares = calculateShares(heirs, netEstate);
    
    setResults({
      totalAmount,
      debts,
      funeralCosts,
      will,
      netEstate,
      shares: inheritanceShares
    });
    setShowResults(true);
  };

  const calculateShares = (heirsList, netEstate) => {
    const shares = [];
    let remainingEstate = netEstate;

    // هذا حساب مبسط للمواريث - في التطبيق الحقيقي يجب استخدام خوارزمية أكثر تعقيداً
    heirsList.forEach(heir => {
      let share = 0;
      let fraction = '';

      switch (heir.type) {
        case 'husband':
          if (heirsList.some(h => h.type === 'son' || h.type === 'daughter')) {
            share = netEstate * 0.25; // الربع
            fraction = '1/4';
          } else {
            share = netEstate * 0.5; // النصف
            fraction = '1/2';
          }
          break;
        case 'wife':
          if (heirsList.some(h => h.type === 'son' || h.type === 'daughter')) {
            share = netEstate * 0.125; // الثمن
            fraction = '1/8';
          } else {
            share = netEstate * 0.25; // الربع
            fraction = '1/4';
          }
          break;
        case 'father':
          if (heirsList.some(h => h.type === 'son')) {
            share = netEstate * 0.167; // السدس
            fraction = '1/6';
          } else {
            share = netEstate * 0.25; // أكثر حسب الحالة
            fraction = 'متغير';
          }
          break;
        case 'mother':
          if (heirsList.some(h => h.type === 'son' || h.type === 'daughter') || 
              heirsList.filter(h => h.type.includes('brother') || h.type.includes('sister')).length >= 2) {
            share = netEstate * 0.167; // السدس
            fraction = '1/6';
          } else {
            share = netEstate * 0.333; // الثلث
            fraction = '1/3';
          }
          break;
        case 'son':
          // الأبناء يأخذون الباقي بعد أصحاب الفروض
          share = remainingEstate * 0.4; // تقدير مبسط
          fraction = 'عصبة';
          break;
        case 'daughter':
          const sonsCount = heirsList.find(h => h.type === 'son')?.count || 0;
          if (sonsCount > 0) {
            // مع وجود أبناء: للذكر مثل حظ الأنثيين
            share = remainingEstate * 0.2; // تقدير مبسط
            fraction = 'عصبة';
          } else if (heir.count === 1) {
            share = netEstate * 0.5; // النصف
            fraction = '1/2';
          } else {
            share = netEstate * 0.667; // الثلثان
            fraction = '2/3';
          }
          break;
        default:
          share = remainingEstate * 0.1; // تقدير افتراضي
          fraction = 'متغير';
      }

      shares.push({
        name: heir.name,
        count: heir.count,
        totalShare: share * heir.count,
        individualShare: share,
        fraction: fraction,
        percentage: ((share * heir.count) / netEstate * 100).toFixed(2)
      });
    });

    return shares;
  };

  const printResults = () => {
    window.print();
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4" dir="rtl">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setShowResults(false)}
                  className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <DocumentTextIcon className="h-8 w-8 text-orange-600 ml-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">نتائج حساب المواريث</h1>
                  <p className="text-gray-600">التوزيع الشرعي للتركة</p>
                </div>
              </div>
              <button
                onClick={printResults}
                className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                <PrinterIcon className="h-5 w-5 ml-2" />
                طباعة
              </button>
            </div>
          </div>

          {/* Estate Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">ملخص التركة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">إجمالي التركة</p>
                <p className="text-2xl font-bold text-blue-900">{results.totalAmount.toLocaleString()} ريال</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600 font-medium">الديون والتكاليف</p>
                <p className="text-2xl font-bold text-red-900">{(results.debts + results.funeralCosts).toLocaleString()} ريال</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">الوصية</p>
                <p className="text-2xl font-bold text-purple-900">{results.will.toLocaleString()} ريال</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">صافي التركة</p>
                <p className="text-2xl font-bold text-green-900">{results.netEstate.toLocaleString()} ريال</p>
              </div>
            </div>
          </div>

          {/* Inheritance Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">توزيع المواريث</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">الوارث</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">العدد</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">النصيب الشرعي</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">النسبة</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">المبلغ الإجمالي</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">المبلغ الفردي</th>
                  </tr>
                </thead>
                <tbody>
                  {results.shares.map((share, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{share.name}</td>
                      <td className="py-3 px-4 text-gray-700">{share.count}</td>
                      <td className="py-3 px-4 text-gray-700">{share.fraction}</td>
                      <td className="py-3 px-4 text-gray-700">{share.percentage}%</td>
                      <td className="py-3 px-4 font-semibold text-green-600">
                        {share.totalShare.toLocaleString()} ريال
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {share.individualShare.toLocaleString()} ريال
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>تنبيه:</strong> هذا الحساب مبسط وقد لا يشمل جميع الحالات الفقهية المعقدة. 
                يُنصح بمراجعة عالم شرعي متخصص في المواريث للحالات المعقدة.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4" dir="rtl">
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
              <CalculatorIcon className="h-8 w-8 text-orange-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">حاسبة المواريث الشرعية</h1>
                <p className="text-gray-600">حساب توزيع التركة وفقاً للشريعة الإسلامية</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estate Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-600 ml-2" />
              <h2 className="text-xl font-bold text-gray-900">بيانات التركة</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إجمالي التركة (ريال يمني)
                </label>
                <input
                  type="number"
                  value={estate.totalAmount}
                  onChange={(e) => setEstate({...estate, totalAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="أدخل إجمالي قيمة التركة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الديون المستحقة (ريال يمني)
                </label>
                <input
                  type="number"
                  value={estate.debts}
                  onChange={(e) => setEstate({...estate, debts: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="أدخل قيمة الديون"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تكاليف الجنازة (ريال يمني)
                </label>
                <input
                  type="number"
                  value={estate.funeralCosts}
                  onChange={(e) => setEstate({...estate, funeralCosts: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="أدخل تكاليف الجنازة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصية (ريال يمني)
                </label>
                <input
                  type="number"
                  value={estate.will}
                  onChange={(e) => setEstate({...estate, will: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="أدخل قيمة الوصية (حد أقصى ثلث التركة)"
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>صافي التركة:</strong> {
                    (parseFloat(estate.totalAmount) || 0) - 
                    (parseFloat(estate.debts) || 0) - 
                    (parseFloat(estate.funeralCosts) || 0) - 
                    (parseFloat(estate.will) || 0)
                  } ريال
                </p>
              </div>
            </div>
          </div>

          {/* Heirs Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="h-6 w-6 text-orange-600 ml-2" />
              <h2 className="text-xl font-bold text-gray-900">الورثة</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">إضافة الورثة:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {heirTypes.map(heirType => (
                    <button
                      key={heirType.id}
                      onClick={() => addHeir(heirType)}
                      className="text-sm bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      {heirType.name}
                    </button>
                  ))}
                </div>
              </div>

              {heirs.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">الورثة المحددون:</h3>
                  <div className="space-y-2">
                    {heirs.map(heir => (
                      <div key={heir.type} className="flex items-center justify-between bg-orange-50 p-3 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{heir.name}</span>
                          <span className="text-sm text-gray-600 mr-2">({heir.count})</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => addHeir({id: heir.type})}
                            className="w-6 h-6 bg-orange-600 text-white rounded-full text-sm hover:bg-orange-700"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeHeir(heir.type)}
                            className="w-6 h-6 bg-red-600 text-white rounded-full text-sm hover:bg-red-700"
                          >
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="mt-6 text-center">
          <button
            onClick={calculateInheritance}
            disabled={!estate.totalAmount || heirs.length === 0}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            حساب المواريث
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>إخلاء مسؤولية:</strong> هذه الحاسبة تقدم حساباً مبسطاً للمواريث وقد لا تشمل جميع الحالات الفقهية المعقدة. 
            للحصول على فتوى دقيقة، يُنصح بمراجعة عالم شرعي متخصص في أحكام المواريث.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InheritanceCalculator;

