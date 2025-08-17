import './ShowEntries.css'; 

const ShowEntries = ({ entriesPerPage, onEntriesChange }) => {
  const options = [5, 10, 25, 50, 100]; 

  return (
    <div className="show-entries-container">
      <label htmlFor="entries-select">Show:</label>
      <select
        id="entries-select"
        value={entriesPerPage}
        onChange={(e) => onEntriesChange(Number(e.target.value))}
        className="entries-select"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span>entries</span>
    </div>
  );
};

export default ShowEntries;