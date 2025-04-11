import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css"; 
import { cn } from "../../lib/utils";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className={cn("p-3 pointer-events-auto w-full", className)}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        showOutsideDays={showOutsideDays}
        fixedWeeks
        
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
        }}
        footer={
          selected
            ? `Selected: ${selected.toLocaleDateString()}`
            : "Pick a day."
        }
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
