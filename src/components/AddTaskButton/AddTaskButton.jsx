import "./AddTaskButton.css";

const AddTaskButton = ({ onClick }) => {
  return (
    <button className="add-task-button" onClick={onClick}>
      + Add Task
    </button>
  );
};

export default AddTaskButton;
