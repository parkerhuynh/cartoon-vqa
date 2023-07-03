import React from 'react';

import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const NestedPieChart = () => {
    const data = [
        { name: 'Category A', value: 100, children: [
          { name: 'Subcategory 1', value: 50 },
          { name: 'Subcategory 2', value: 30 },
          { name: 'Subcategory 3', value: 20 },
        ]},
        { name: 'Category B', value: 200, children: [
          { name: 'Subcategory 4', value: 100 },
          { name: 'Subcategory 5', value: 50 },
          { name: 'Subcategory 6', value: 50 },
        ]},
        // Add more categories and subcategories as needed
      ];

      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        innerRadius={40}
        fill="#8884d8"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Pie
        data={data.flatMap((entry) => entry.children)}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={80}
        outerRadius={120}
        fill="#82ca9d"
        label
      >
        {data.flatMap((entry, index) =>
          entry.children.map((child, childIndex) => (
            <Cell key={`cell-${index}-${childIndex}`} fill={COLORS[childIndex % COLORS.length]} />
          ))
        )}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default NestedPieChart;