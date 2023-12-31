import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function EditableText({
  text,
  onSubmit,
}: {
  text: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState(text);
  const [editing, setEditing] = useState(false);

  return (
    <div className="py-4 px-4">
      {editing ? (
        <Textarea
          className="bg-white min-h-[20px]"
          value={value}
          autoFocus
          spellCheck={false}
          rows={1}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onFocus={(e) => {
            e.target.select();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              e.preventDefault();
              setEditing(false);
              if (value.length > 0 && value !== text) {
                onSubmit(value);
              } else {
                setValue(text);
              }
            }
          }}
          onBlur={() => {
            setEditing(false);
            onSubmit(value);
          }}
        />
      ) : (
        <h2
          className="text-lg font-semibold leading-snug"
          onClick={() => setEditing(true)}
        >
          {value}
        </h2>
      )}
    </div>
  );
}
