import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../../components/ui/button";

// CSS inline cho ngày trong tuần
const weekdayStyles = {
  width: "36px",
  textAlign: "center",
  fontWeight: "bold",
  padding: "0",
  margin: "0",
  display: "inline-block",
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks={true}
      className={cn("p-3 pointer-events-auto w-full", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-2",
        caption: "flex justify-between items-center relative font-bold text-lg mb-2",
        caption_label: "text-center w-full ml-22",
        nav: "flex items-center justify-between absolute inset-x-0 top-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7", // Sử dụng grid để có 7 cột
        head_cell: "", // Bỏ trống để dùng inline style
        row: "grid grid-cols-7",
        cell: "h-9 w-9 text-center text-sm p-0",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal rounded-full text-center"
        ),
        day_selected: "bg-primary-600 text-white font-bold rounded-full",
        day_today: "bg-primary-600 text-primary-600 rounded-full font-bold",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      modifiersClassNames={{
        weekday: "custom-weekday", // Thêm class tùy chỉnh để áp dụng inline style
      }}
      style={{
        ".rdp .rdp-weekday": weekdayStyles, // Áp dụng CSS trực tiếp
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
