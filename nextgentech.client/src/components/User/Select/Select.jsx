// Select.jsx
const SelectField = ({ label, options, value, onChange }) => (
    <div className="overflow-hidden">
      <p className="text-sm text-gray-500">{label}</p>
      <select
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
  
  export default SelectField;
  