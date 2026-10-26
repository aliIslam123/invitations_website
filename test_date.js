const d1 = new Date('2026-11-16T19:00:00+02:00');
const d2 = new Date('2026-11-16');
console.log('ar-SA d1:', d1.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
console.log('ar-EG d1:', d1.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
console.log('ar-SA d2:', d2.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
console.log('ar-EG d2:', d2.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
