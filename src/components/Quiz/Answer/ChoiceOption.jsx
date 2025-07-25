import clsx from "clsx";

const ChoiceOption = ({ listChoice, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {listChoice?.map((el) => (
        <div
          key={el.id}
          className={clsx(
            "p-3 flex items-center gap-4 cursor-pointer border rounded-md transition-all",
            el?.selected
              ? "bg-green-100 border-green-400"
              : "bg-blue-50 border-blue-200"
          )}
          onClick={() => onChange(el.id)}
        >
          <input
            type="radio"
            checked={el?.selected}
            readOnly
            className="size-4"
          />
          <span>{el?.option_text}</span>
        </div>
      ))}
    </div>
  );
};

export default ChoiceOption;
