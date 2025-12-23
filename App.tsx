
import React, { useState, useMemo, useEffect } from 'react';
import { NS_RECIPE } from './constants';
import { Ingredient } from './types';

type UnitMode = 'auto' | 'g' | 'mg' | 'kg';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<boolean>(false);
  
  const [volume, setVolume] = useState<number>(100);
  const [unitMode, setUnitMode] = useState<UnitMode>('auto');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Password Verification
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === '1111') {
      setIsAuthorized(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setPassword('');
      // Reset error after animation
      setTimeout(() => setLoginError(false), 500);
    }
  };

  const formatResult = (grams: number, mode: UnitMode) => {
    let displayVal = grams;
    let displayUnit = 'g';

    if (mode === 'kg' || (mode === 'auto' && grams >= 1000)) {
      displayVal = grams / 1000;
      displayUnit = 'kg';
    } else if (mode === 'mg' || (mode === 'auto' && grams < 0.1 && grams > 0)) {
      displayVal = grams * 1000;
      displayUnit = 'mg';
    } else {
      displayVal = grams;
      displayUnit = 'g';
    }

    const formattedVal = parseFloat(displayVal.toFixed(4)).toString();
    return { value: formattedVal, unit: displayUnit };
  };

  const results = useMemo(() => {
    return NS_RECIPE.map(ingredient => {
      const totalGrams = ingredient.concentration * volume;
      return {
        ...ingredient,
        ...formatResult(totalGrams, unitMode)
      };
    });
  }, [volume, unitMode]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(isNaN(val) ? 0 : val);
  };

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedItems(newChecked);
  };

  const copyPurchaseList = () => {
    const listText = results
      .map((item, index) => `${index + 1}. ${item.name}: ${item.value}${item.unit}`)
      .join('\n');
    const header = `--- NS 培养基采购清单 (总规模: ${volume}L) ---\n日期: ${new Date().toLocaleDateString()}\n\n`;
    navigator.clipboard.writeText(header + listText).then(() => {
      alert('采购清单已成功复制到剪贴板！');
    });
  };

  // Login Screen Component
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <div className={`max-w-md w-full bg-white/10 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 transition-transform ${loginError ? 'animate-shake' : ''}`}>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl shadow-lg shadow-emerald-500/20 mx-auto flex items-center justify-center mb-6">
              <i className="fas fa-shield-halved text-3xl text-white"></i>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">实验室访问控制</h2>
            <p className="text-emerald-400/60 text-[10px] font-bold tracking-[0.3em] mt-2 uppercase">Laboratory Access Restricted</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">请输入授权访问码</label>
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-center text-3xl tracking-[1em] text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 transition-all active:scale-95"
            >
              验证身份
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-[10px] font-bold">由智能生物产业系统提供技术支持</p>
          </div>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 selection:bg-emerald-100 pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-br from-emerald-600 to-teal-800 -z-10 shadow-lg"></div>
      <div className="fixed top-0 left-0 w-full h-64 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-10"></div>

      {/* Header */}
      <header className="pt-8 pb-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
              <i className="fas fa-flask-vial text-3xl text-emerald-600"></i>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">NS 培养基工业计算中心</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="bg-emerald-400/20 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 uppercase tracking-widest">v2.5 Enterprise</span>
                <span className="text-emerald-100/70 text-xs font-medium">智能单位转换 · 一键采购清单</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={() => window.print()}
              className="bg-white/90 hover:bg-white text-emerald-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <i className="fas fa-print"></i> 导出 PDF
            </button>
            <button 
              onClick={() => setIsAuthorized(false)}
              className="bg-rose-500/20 hover:bg-rose-500 text-white w-10 h-10 rounded-xl transition-all flex items-center justify-center border border-rose-500/30"
              title="锁定系统"
            >
              <i className="fas fa-lock text-xs"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls & Config */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Main Input Card */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200/50">
            <div className="mb-8">
              <label htmlFor="volume" className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                <i className="fas fa-fill-drip text-emerald-500"></i>
                设定总配制体积
              </label>
              <div className="relative group">
                <input
                  type="number"
                  id="volume"
                  min="0"
                  value={volume || ''}
                  onChange={handleVolumeChange}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-6 text-5xl font-black text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all tabular-nums"
                  placeholder="0"
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl group-focus-within:text-emerald-500 transition-colors">L</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[10, 100, 500, 1000, 2000, 5000].map((v) => (
                <button
                  key={v}
                  onClick={() => setVolume(v)}
                  className={`py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                    volume === v
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
                  }`}
                >
                  {v >= 1000 ? (v / 1000).toFixed(0) + 'T' : v + 'L'}
                </button>
              ))}
            </div>
          </section>

          {/* Unit Control Card */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200/50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <i className="fas fa-sliders text-emerald-500"></i>
              计量单位控制
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'auto', label: '智能识别', icon: 'fa-wand-sparkles' },
                { id: 'kg', label: '千克 (kg)', icon: 'fa-weight-hanging' },
                { id: 'g', label: '克 (g)', icon: 'fa-scale-unbalanced' },
                { id: 'mg', label: '毫克 (mg)', icon: 'fa-microscope' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setUnitMode(m.id as UnitMode)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                    unitMode === m.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                      : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  <i className={`fas ${m.icon} text-lg ${unitMode === m.id ? 'text-emerald-400' : 'opacity-40'}`}></i>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Purchase Helper Card */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
                <i className="fas fa-cart-shopping text-emerald-400"></i>
                物料采购助手
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                已根据当前配制体量自动生成标准采购格式。点击下方按钮即可复制明细发送给供应商。
              </p>
              <button 
                onClick={copyPurchaseList}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/40"
              >
                复制完整采购清单
              </button>
            </div>
            <i className="fas fa-truck absolute -right-6 -bottom-6 text-9xl opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700"></i>
          </section>
        </aside>

        {/* Right Column: Data Visualization */}
        <section className="lg:col-span-8 space-y-8">
          {/* Main Data Table */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-800">配方剂量矩阵</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Ingredients Matrix</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">已核对成分</span>
                <span className="text-2xl font-black text-emerald-600">{checkedItems.size} <span className="text-slate-300">/ {results.length}</span></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">
                    <th className="pl-10 pr-4 py-6 border-b border-slate-50 bg-slate-50/30">状态</th>
                    <th className="px-4 py-6 border-b border-slate-50 bg-slate-50/30">原料详情</th>
                    <th className="px-4 py-6 border-b border-slate-50 bg-slate-50/30">单位用量</th>
                    <th className="pl-4 pr-10 py-6 border-b border-slate-50 bg-slate-50/30 text-right">总称重量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {results.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`group hover:bg-emerald-50/40 transition-all cursor-pointer ${checkedItems.has(item.id) ? 'opacity-50' : ''}`}
                      onClick={() => toggleCheck(item.id)}
                    >
                      <td className="pl-10 pr-4 py-8">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all border-2 ${
                          checkedItems.has(item.id) 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'bg-white border-slate-100 text-transparent group-hover:border-emerald-300'
                        }`}>
                          <i className="fas fa-check text-xs"></i>
                        </div>
                      </td>
                      <td className="px-4 py-8">
                        <div className={`font-bold text-lg transition-all ${checkedItems.has(item.id) ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {item.chemicalFormula && (
                            <span className="text-[9px] text-slate-400 font-black bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {item.chemicalFormula}
                            </span>
                          )}
                          {item.description && (
                            <span className="text-[9px] text-emerald-600 font-black italic uppercase tracking-wider opacity-60">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-8">
                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{item.concentration} <span className="opacity-50 font-medium lowercase">g/l</span></span>
                      </td>
                      <td className="pl-4 pr-10 py-8 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className={`text-3xl font-black tabular-nums transition-colors ${
                            checkedItems.has(item.id) ? 'text-slate-300' :
                            item.unit === 'mg' ? 'text-amber-500' : 
                            item.unit === 'kg' ? 'text-emerald-700' : 'text-emerald-500'
                          }`}>
                            {item.value}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 -mt-1 uppercase tracking-[0.2em]">{item.unit === 'g' ? 'Grams' : item.unit === 'kg' ? 'Kilograms' : 'Milligrams'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Guidance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                <i className="fas fa-droplet text-xl"></i>
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">定容说明</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">加水至刻度线确保总体积为 <span className="text-slate-900 font-bold">{volume}L</span>，严禁超出。</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
                <i className="fas fa-compass-drafting text-xl"></i>
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">pH 调节</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">光合菌培养需控制在 <span className="text-slate-900 font-bold">7.0 - 7.5</span>，灭菌前后需二次校准。</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
                <i className="fas fa-biohazard text-xl"></i>
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">灭菌规范</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">工业大槽建议采用 <span className="text-slate-900 font-bold">121°C / 20min</span> 连续灭菌工艺。</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-slate-200 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center gap-10 mb-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             <i className="fas fa-microchip text-4xl"></i>
             <i className="fas fa-gears text-4xl"></i>
             <i className="fas fa-atom text-4xl"></i>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Designed for Smart Bio-Industries © 2025</p>
          <div className="flex justify-center gap-6 text-slate-300 text-xs font-bold">
            <span className="hover:text-emerald-600 cursor-help">系统状态: 正常</span>
            <span className="hover:text-emerald-600 cursor-help">数据来源: NS Standard</span>
            <span className="hover:text-emerald-600 cursor-help">高精度模式: 已开启</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
