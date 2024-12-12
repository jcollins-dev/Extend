/**
 * Converts table data to CSV
 * Example:
  
  const data = [
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "San Francisco" },
    { name: "Charlie", age: 35, city: "Los Angeles" },
  ];
  
  const csv = convertToCSV(data);

  This would output the following CSV string:
  name,age,city
  "Alice",25,"New York"
  "Bob",30,"San Francisco"
  "Charlie",35,"Los Angeles"
*/
export const convertToCSV = (
  data: Record<string, unknown>[],
  headers?: Record<string, unknown>
): string => {
  // Extract all the unique keys from the data
  const keys = Array.from(new Set(data.flatMap((record) => Object.keys(record))));

  // Create the header row of the CSV
  const headerRow = keys.map((k) => headers?.[k] || k).join(',') + '\n';

  // Create the data rows of the CSV
  const dataRows = data
    .map((record) =>
      keys.map((key) => (record[key] !== undefined ? String(record[key]) : '')).join(',')
    )
    .join('\n');

  // Combine the header row and data rows into the final CSV string
  return headerRow + dataRows;
};
