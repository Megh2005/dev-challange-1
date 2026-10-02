"use client";

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiClock, FiCalendar } from "react-icons/fi";

export interface DatePickerProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  className?: string;
}

export const ClayDatePicker: React.FC<DatePickerProps> = ({
  selectedDate = new Date(),
  onSelectDate,
  className = "",
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );
  const [selected, setSelected] = useState<Date>(selectedDate);

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Days calculation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const handleDayClick = (day: number) => {
    const d = new Date(year, month, day);
    setSelected(d);
    onSelectDate?.(d);
  };

  const isSelected = (day: number) => {
    return (
      selected.getDate() === day &&
      selected.getMonth() === month &&
      selected.getFullYear() === year
    );
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-clay-2xl bg-[#FAF8F5] shadow-clay border border-white/90 select-none max-w-[320px] ${className}`}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 rounded-clay-pill bg-[#EFECE5] text-[#5C6479] shadow-clay-sm flex items-center justify-center hover:bg-[#E7E2D9] active:shadow-clay-pressed"
        >
          <FiChevronLeft />
        </button>
        <span className="text-sm font-bold text-[#2B2D42]">
          {monthNames[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 rounded-clay-pill bg-[#EFECE5] text-[#5C6479] shadow-clay-sm flex items-center justify-center hover:bg-[#E7E2D9] active:shadow-clay-pressed"
        >
          <FiChevronRight />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {dayLabels.map((lbl) => (
          <span key={lbl} className="text-[11px] font-bold text-[#8D99AE]">
            {lbl}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="w-8 h-8" />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const active = isSelected(day);
          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`w-8 h-8 rounded-clay-pill text-xs font-semibold flex items-center justify-center transition-all ${
                active
                  ? "bg-[#D96B43] text-white shadow-clay-primary scale-105"
                  : "text-[#2B2D42] hover:bg-[#EFECE5] hover:shadow-clay-sm active:shadow-clay-pressed"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export interface TimePickerProps {
  time?: string; // "14:30"
  onChange?: (time: string) => void;
  className?: string;
}

export const ClayTimePicker: React.FC<TimePickerProps> = ({
  time = "12:00",
  onChange,
  className = "",
}) => {
  const [hours, minutes] = time.split(":").map(Number);

  const setHour = (h: number) => {
    const formatted = `${String(h).padStart(2, "0")}:${String(minutes || 0).padStart(2, "0")}`;
    onChange?.(formatted);
  };

  const setMin = (m: number) => {
    const formatted = `${String(hours || 0).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    onChange?.(formatted);
  };

  return (
    <div
      className={`p-4 rounded-clay-2xl bg-[#FAF8F5] shadow-clay border border-white/90 max-w-[280px] select-none ${className}`}
    >
      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#4F5D73]">
        <FiClock className="text-[#D96B43]" />
        <span>SELECT TIME</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-semibold text-[#8D99AE] mb-1">HOURS</span>
          <div className="bg-[#EAE6DC] p-1 rounded-clay-lg shadow-clay-inset flex items-center gap-1">
            {[9, 12, 14, 17, 20].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHour(h)}
                className={`w-7 h-7 text-xs font-bold rounded-clay-md transition-all ${
                  hours === h
                    ? "bg-[#D96B43] text-white shadow-clay-primary"
                    : "text-[#2B2D42] hover:bg-black/5"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
        <span className="text-lg font-bold text-[#8D99AE] mt-4">:</span>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-semibold text-[#8D99AE] mb-1">MINS</span>
          <div className="bg-[#EAE6DC] p-1 rounded-clay-lg shadow-clay-inset flex items-center gap-1">
            {[0, 15, 30, 45].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMin(m)}
                className={`w-7 h-7 text-xs font-bold rounded-clay-md transition-all ${
                  minutes === m
                    ? "bg-[#588B76] text-white shadow-clay-sage"
                    : "text-[#2B2D42] hover:bg-black/5"
                }`}
              >
                {String(m).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
