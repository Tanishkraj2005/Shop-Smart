/* SIZE CHART DATA */
const SIZE_CHARTS = {
    tops: {
        title: 'Tops, T-Shirts & Shirts',
        headers: ['Size', 'Chest (in)', 'Shoulder (in)', 'Length (in)'],
        rows: [
            ['XS', '34–36', '15.5', '26'],
            ['S', '36–38', '16.5', '27'],
            ['M', '38–40', '17.5', '28'],
            ['L', '40–42', '18.5', '29'],
            ['XL', '42–44', '19.5', '30'],
            ['XXL', '44–46', '20.5', '31'],
        ],
    },
    bottoms: {
        title: 'Jeans, Trousers & Chinos',
        headers: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
        rows: [
            ['28', '28', '36', '30'],
            ['30', '30', '38', '30'],
            ['32', '32', '40', '31'],
            ['34', '34', '42', '31'],
            ['36', '36', '44', '32'],
            ['38', '38', '46', '32'],
        ],
    },
    shoes: {
        title: 'Shoes & Footwear',
        headers: ['UK', 'US', 'EU', 'Foot Length (cm)'],
        rows: [
            ['6', '7', '40', '24.5'],
            ['7', '8', '41', '25.5'],
            ['8', '9', '42', '26.5'],
            ['9', '10', '43', '27.5'],
            ['10', '11', '44', '28.5'],
            ['11', '12', '45', '29.5'],
        ],
    },
}

export default function SizeGuide({ category = 'tops', onClose }) {
    const chart = SIZE_CHARTS[category] || SIZE_CHARTS.tops

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-extrabold">📏 Size Guide</h2>
                        <p className="text-sm text-gray-400">{chart.title}</p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition-colors text-xl">✕</button>
                </div>

                {/* Category Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 pt-4 gap-4">
                    {Object.keys(SIZE_CHARTS).map(key => (
                        <span key={key} className={`pb-2 text-sm font-semibold capitalize border-b-2 cursor-pointer transition-colors ${category === key ? 'border-amber-400 text-amber-500' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                            {key}
                        </span>
                    ))}
                </div>
                {/* Table */}
                <div className="p-6 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50">
                                {chart.headers.map(h => (
                                    <th key={h} className="py-3 px-4 text-left font-bold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {chart.rows.map((row, i) => (
                                <tr key={i} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-700/20'}`}>
                                    {row.map((cell, j) => (
                                        <td key={j} className={`py-3 px-4 ${j === 0 ? 'font-extrabold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">💡 Measurement Tips</p>
                        <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-1">
                            <li>• Measure on bare skin for best accuracy</li>
                            <li>• Keep the measuring tape snug but not tight</li>
                            <li>• When between sizes, choose the larger one</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
