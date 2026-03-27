import React from "react";

export default function EmployeeProfileCard({ employee }) {
  if (!employee) return null;
  return (
    <div className="bg-white rounded-2xl shadow-md border border-blue-200 p-4 mb-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-blue-900 mb-2">Employee Profile</h3>
      <div className="text-gray-800 font-medium mb-1">{employee.name}</div>
      <div className="text-gray-600 text-sm mb-1">Email: {employee.email}</div>
      {employee.department && (
        <div className="text-gray-600 text-sm mb-1">Department: {employee.department}</div>
      )}
      {employee.salary !== undefined && (
        <div className="text-gray-600 text-sm mb-1">Salary: ${employee.salary}</div>
      )}
      {/* {employee.user_id && (
        <div className="text-gray-500 text-xs">User ID: {employee.user_id}</div>
      )} */}
    </div>
  );
}
