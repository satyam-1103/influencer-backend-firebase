export const exportToCsv = (filename, rows, headers) => {
  if (!rows || !rows.length) return;

  const csvContent = [
    headers.map(h => `"${h.label}"`).join(','),
    ...rows.map(row => 
      headers.map(h => {
        let val = typeof h.key === 'function' ? h.key(row) : row[h.key];
        val = val === null || val === undefined ? '' : String(val);
        val = val.replace(/"/g, '""');
        return `"${val}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
