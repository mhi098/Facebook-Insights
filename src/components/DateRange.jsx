import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import {
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import { enGB } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useSearchParams } from "react-router-dom";
import moment from "moment/moment";

const customDates = [
  { label: "Last 7 Days", value: "last7Days" },
  { label: "Last 28 Days", value: "last28Days" },
  { label: "Last 90 Days", value: "last90Days" },
  { label: "This Week", value: "thisWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Week", value: "lastWeek" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Lifetime", value: "lifetime" },
  { label: "Custom", value: "custom" },
];

const DateRange = ({ onRangeSelect, show, onHide }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [customRange, setCustomRange] = useState("last7Days");
  const [selectedValue, setSelectedValue] = useState("");

  const [compare, setCompare] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    let startDate = searchParams.get("startDate");
    let endDate = searchParams.get("endDate");
    let range = searchParams.get("range");
    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      const newRange = {
        startDate,
        endDate,
        key: "selection",
      };
      if (range) {
        setCustomRange(range);
      }

      setRange([newRange]);
    }
  }, []);

  const updateQuery = (start, end, range) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("startDate", start); // Add or update a query parameter
    newParams.set("endDate", end);
    newParams.set("range", range);
    setSearchParams(newParams);
  };

  const handleCheckboxChange = (event) => {
    setCompare(event.target.checked);
  };
  const handlePeriod = (value) => {
    setSelectedValue(value);
  };
  const formatMonth = (date) => format(date, "MMMM yyyy");
  const formatLabel = (value) => {
    const customDate = customDates.find((date) => date.value === value);
    return customDate.label;
  };
  // Get Custom Range
  const getCustomRange = (rangeName) => {
    switch (rangeName) {
      case "last7Days":
        return {
          startDate: subDays(new Date(), 7),
          endDate: new Date(),
        };
      case "last28Days":
        return {
          startDate: subDays(new Date(), 28),
          endDate: new Date(),
        };
      case "last90Days":
        return {
          startDate: subDays(new Date(), 90),
          endDate: new Date(),
        };
      case "thisWeek":
        return {
          startDate: startOfWeek(new Date()),
          endDate: endOfWeek(new Date()),
        };
      case "thisMonth":
        return {
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date()),
        };
      case "thisYear":
        return {
          startDate: startOfYear(new Date()),
          endDate: endOfYear(new Date()),
        };
      case "lastWeek":
        return {
          startDate: startOfWeek(subDays(new Date(), 7)),
          endDate: endOfWeek(subDays(new Date(), 7)),
        };
      case "lastMonth":
        return {
          startDate: startOfMonth(subMonths(new Date(), 1)),
          endDate: endOfMonth(subMonths(new Date(), 1)),
        };
      case "lifetime":
        return {
          startDate: new Date(2000, 0, 1),
          endDate: new Date(),
        };
      default:
        return {
          startDate: new Date(),
          endDate: new Date(),
        };
    }
  };

  // Handle Custom Range Selection
  const handleCustomRange = (rangeName) => {
    const newRange = getCustomRange(rangeName);
    setCustomRange(rangeName);
    setRange([
      {
        startDate: newRange.startDate,
        endDate: newRange.endDate,
        key: "selection",
      },
    ]);
  };

  const handleUpdate = () => {
    const { startDate, endDate } = range[0];
    onRangeSelect({ startDate, endDate }); // Pass the selected range back to Insights component
    updateQuery(startDate, endDate, customRange);
    onHide();
  };

  return (
    <div className={`date_range_container ${!show && "d-none"}`}>
      {/* Custom Range Options */}
      <div className="pt-3 shadow " style={{ padding: "5px" }}>
        {customDates.map((option) => (
          <div key={option.value} className="mb-2 px-2">
            <label className="fs-13 fw-semibold cursor-pointer d-flex align-items-center gap-2 ">
              <input
                type="radio"
                name="firstCustomRange"
                className="form-check-input cursor-pointer fs-4"
                value={option.value}
                checked={customRange === option.value}
                onChange={() => handleCustomRange(option.value)}
              />
              <span className="gray-text">{option.label}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="pt-3">
        <DateRangePicker
          onChange={(item) => {
            setRange([item.selection]);
            setCustomRange("custom");
          }}
          showSelectionPreview={false}
          moveRangeOnFirstSelection={false}
          ranges={range}
          months={2}
          direction="horizontal"
          locale={enGB}
          maxDate={new Date()}
          navigatorRenderer={(currentDisplayedDate, onChange) => (
            <div className="px-3 d-flex align-items-center justify-content-between pb-2">
              <div className="d-flex align-items-center w-50">
                <div
                  className="cursor-pointer"
                  onClick={() => onChange(subMonths(currentDisplayedDate, 1))}
                  style={{
                    width: "16px",
                    height: "16px",
                    maskImage:
                      'url("https://static.xx.fbcdn.net/rsrc.php/v4/yh/r/eHiV0Aq3-LC.png?_nc_eui2=AeETZbnxGlHep7j3aReYv1MVvUdT5naLG9W9R1Pmdosb1QmLo13PIw0uKaKijXuLzBs5MJ65lmYrNnixwJ8ekMRo")',
                    maskPosition: "-51px -266px",
                    maskSize: "auto",
                    background: "black",
                    display: "inline-block",
                  }}
                ></div>
                <span className="fw-semibold fs-13 ms-2">
                  {formatMonth(currentDisplayedDate)}
                </span>
              </div>
              <div className="d-flex align-items-center w-50 justify-content-end">
                <span className="fw-semibold fs-13 me-2">
                  {formatMonth(addMonths(currentDisplayedDate, 1))}
                </span>
                <div
                  className="cursor-pointer"
                  onClick={() => onChange(addMonths(currentDisplayedDate, 1))}
                  style={{
                    width: "16px",
                    height: "16px",
                    maskImage:
                      'url("https://static.xx.fbcdn.net/rsrc.php/v4/yh/r/eHiV0Aq3-LC.png?_nc_eui2=AeETZbnxGlHep7j3aReYv1MVvUdT5naLG9W9R1Pmdosb1QmLo13PIw0uKaKijXuLzBs5MJ65lmYrNnixwJ8ekMRo")',
                    maskPosition: "-102px -266px",
                    maskSize: "auto",
                    background: "black",
                    display: "inline-block",
                  }}
                ></div>
              </div>
            </div>
          )}
        />
        <div className="pe-2 pb-2">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              id="compare"
              className="compare form-check-input mt-0"
              style={{ fontSize: "18px" }}
              checked={compare}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="compare" className="fs-14 ">
              Compare
            </label>
          </div>
          <div className="d-flex gap-2 mt-2">
            <div className="w-50">
              <div class="dropdown">
                <button
                  class="btn py-1 fs-14 w-100 insight_btn fw-semibold  d-flex align-items-center justify-content-between dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {customRange ? formatLabel(customRange) : "Last 28 days"}
                </button>
                <div
                  className="p-2 shadow dropdown-menu"
                  style={{ padding: "10px" }}
                >
                  {customDates.map((option) => (
                    <div
                      key={option.value}
                      className="mb-1 px-2 btn-hover d-flex align-items-center pb-1 rounded"
                      style={{ width: "200px" }}
                    >
                      <label className="fs-13 fw-semibold cursor-pointer d-flex align-items-center gap-2 ">
                        <input
                          type="radio"
                          name="customRange"
                          className="form-check-input cursor-pointer fs-4"
                          value={option.value}
                          checked={customRange === option.value}
                          onChange={() => handleCustomRange(option.value)}
                        />
                        <span className="gray-text">{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="w-50 d-flex  align-items-center"
              style={{ gap: "2px" }}
            >
              <button
                class="btn py-1 fs-14 w-50 insight_btn  d-flex align-items-center"
                type="button"
              >
                {moment(range[0].startDate).format("MMM DD, YYYY")}
              </button>
              -
              <button
                class="btn py-1 fs-14 w-50 insight_btn  d-flex align-items-center "
                type="button"
              >
                {moment(range[0].endDate).format("MMM DD, YYYY")}
              </button>
            </div>
          </div>
          {compare && (
            <div className="d-flex gap-2 mt-2">
              <div className="w-50">
                <div class="dropdown ">
                  <button
                    class="btn py-1 fs-14 w-100 insight_btn fw-semibold dropdown-toggle d-flex align-items-center justify-content-between"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {selectedValue
                      ? formatLabel(selectedValue)
                      : "Previous period"}
                  </button>
                  <div
                    className="p-2 shadow dropdown-menu"
                    style={{ padding: "10px" }}
                  >
                    {[
                      { label: "Previous period", value: "previousPeriod" },
                      { label: "Previous month", value: "previousMonth" },
                      { label: "Previous quarter", value: "previousQuarter" },
                      { label: "Previous year", value: "previousYear" },
                      { label: "Custom", value: "custom" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="mb-1 px-2 "
                        style={{ width: "200px" }}
                      >
                        <label className="fs-13 fw-semibold cursor-pointer d-flex align-items-center gap-2 ">
                          <input
                            type="radio"
                            name="period"
                            className="form-check-input cursor-pointer fs-4"
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={() => handlePeriod(option.value)}
                          />
                          <span className="gray-text">{option.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="w-50 d-flex  align-items-center"
                style={{ gap: "2px" }}
              >
                <button
                  class="btn py-1 fs-14 w-50 insight_btn  d-flex align-items-center"
                  type="button"
                >
                  Oct 15, 2024
                </button>
                -
                <button
                  class="btn py-1  w-50 insight_btn gray-text  d-flex align-items-center "
                  type="button"
                >
                  Nov 11, 2024
                </button>
              </div>
            </div>
          )}

          <div className="d-flex align-items-center justify-content-between mt-3">
            <span className="fs-12 text-muted">
              Dates are shown in Pacific Time
            </span>
            <div>
              <button
                className="btn cancel_btn"
                style={{ marginRight: "10px" }}
                onClick={onHide}
              >
                Cancel
              </button>
              <button className="btn update_btn" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRange;
