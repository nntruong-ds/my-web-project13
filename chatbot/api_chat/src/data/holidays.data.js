const holidays = [
  { date: "01/01", name: "Tết Dương lịch" },
  { date: "30/04", name: "Giải phóng miền Nam" },
  { date: "01/05", name: "Quốc tế Lao động" },
  { date: "02/09", name: "Quốc khánh" }
];

function formatHolidays() {
  return holidays
    .map(h => `- ${h.date}: ${h.name}`)
    .join("\n");
}
console.log("HOLIDAY EXPORT CHECK:", { holidays, formatHolidays });
module.exports = { holidays, formatHolidays };
