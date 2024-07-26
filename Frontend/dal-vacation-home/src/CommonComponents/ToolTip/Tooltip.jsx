
import './Tooltip.css';

const Tooltip = ({ text, visible }) => {
  return (
    <div className={`tooltip ${visible ? 'visible' : ''}`}>
      {text}
    </div>
  );
};

export default Tooltip;
