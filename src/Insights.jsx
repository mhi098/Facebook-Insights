import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/js/bootstrap.min.js";
import * as bootstrap from "bootstrap";
import LineGraph from "./components/LIneGraph";

import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
import { FaFacebook } from "react-icons/fa";

import DateRange from "./components/DateRange";
import { subDays } from "date-fns";

// images
import overview from "./assets/overview.png";
import whiteOverview from "./assets/white-review.png";
import audience from "./assets/audience.png";
import whiteAudience from "./assets/white-audience.png";
import bench from "./assets/bench.png";
import whiteBench from "./assets/white-bench.png";
import content from "./assets/content.png";
import whiteContent from "./assets/white-content.png";
import subs from "./assets/desc.png";
import whiteSubs from "./assets/white-subs.png";
import message from "./assets/message.png";
import whiteMessage from "./assets/white-message.png";
import overview2 from "./assets/overview2.png";
import whiteOVerview2 from "./assets/white-review2.png";
import plan from "./assets/plan.png";
import whitePlan from "./assets/white-plan.png";
import result from "./assets/result.png";
import whiteResult from "./assets/white-result.png";
import earning from "./assets/earning.png";
import whiteEarning from "./assets/white-earning.png";
import home1 from "./assets/home-bl.png";
import home2 from "./assets/home-wh.png";
import bell1 from "./assets/bell-bl.png";
import bell2 from "./assets/bell-wh.png";
import inbox1 from "./assets/inbox-bl.png";
import inbox2 from "./assets/inbox-wh.png";
import calender1 from "./assets/calendr-bl.png";
import calender2 from "./assets/calendr-wh.png";
import content1 from "./assets/content2.png";
import content2 from "./assets/content-wh.png";
import speaker1 from "./assets/speaker-bl.png";
import speaker2 from "./assets/speaker-wh.png";
import menu1 from "./assets/menu-bl.png";
import menu2 from "./assets/menu-wh.png";

import settings1 from "./assets/setting-bl.png";
import settings2 from "./assets/setting-wh.png";
import insight1 from "./assets/insight.bl.png";
import insight2 from "./assets/insight-wh.png";
import reelIcon from "../src/assets/reel-icon.webp";
import moment from "moment/moment";
import axios from "axios";
import { formatWithCommas } from "./utils/numberHandler";
import { useSearchParams } from "react-router-dom";

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

const Insights = () => {
  const [searchParams] = useSearchParams();
  let range = searchParams.get("range");

  const scrollDivRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [percents, setPercents] = useState({ percent: 0, type: "red" });
  const [totalEarning, setTotalEarning] = useState("0.00");
  const [typeEarnings, setTypeEarnings] = useState([]);
  const [earningTab, setEarningTab] = useState("total");
  const [scrolled, setScrolled] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [activeButton, setActiveButton] = useState("earnings");
  const [activeIcon, setActiveIcon] = useState("insight");
  const [posts, setPosts] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customRange, setCustomRange] = useState(range ? range : "last7Days");

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false); // Set loading to false after some time
  //   }, 1000); // 3 seconds delay for demonstration
  // }, []);

  let startDate = searchParams.get("startDate");
  let endDate = searchParams.get("endDate");
  const [selectedRange, setSelectedRange] = useState({
    startDate: startDate ? new Date(startDate) : subDays(new Date(), 7),
    endDate: endDate ? new Date(endDate) : new Date(),
  });

  useEffect(() => {
    let range = searchParams.get("range");
    if (range) {
      setCustomRange(range);
    }
  }, [searchParams]);

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
  };

  const toggleDatePicker = () => {
    setOpenDatePicker(!openDatePicker);
  };
  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };
  const handleIconClick = (iconId) => {
    setActiveIcon(iconId);
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check the scrollTop position of the div
      if (scrollDivRef.current.scrollTop > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const div = scrollDivRef.current;

    // Add scroll event listener to the specific div
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  // tooltip initialization
  useEffect(() => {
    // Select all tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    // Iterate over each tooltip element
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      // Destroy tooltip if element is not visible
      if (tooltipTriggerEl.offsetParent === null) {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (tooltipInstance) {
          tooltipInstance.dispose(); // Dispose the tooltip
        }
      } else {
        // Initialize tooltip if the element is visible
        const currentTooltipInstance =
          bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (!currentTooltipInstance) {
          new bootstrap.Tooltip(tooltipTriggerEl); // Initialize tooltip if not already
        }
      }
    });

    // Cleanup function to dispose of all tooltips when the component is unmounted
    return () => {
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (tooltipInstance) {
          tooltipInstance.dispose();
        }
      });
    };
  }, [isCollapsed]); // Trigger when `isCollapsed` changes

  useEffect(() => {
    // Initialize the popover
    const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    popoverTriggerList.map((popoverTriggerEl) => {
      return new window.bootstrap.Popover(popoverTriggerEl);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const startDate = moment(selectedRange.startDate).format("YYYY-MM-DD");
    const endDate = moment(selectedRange.endDate).format("YYYY-MM-DD");
    axios
      .get(`/earnings/get_by_dates?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => {
        setTotalEarning(res.data?.overallEarnings?.toFixed(2) || "0.00");
        setPosts(res.data?.posts || []);
        setTypeEarnings(res.data?.typeWiseEarnings || []);
      })
      .finally(() => setLoading(false));
  }, [selectedRange]);

  const formatLabel = (value) => {
    const customDate = customDates.find((date) => date.value === value);
    return customDate.label;
  };

  const getTypeEarning = (type) => {
    const earning = typeEarnings.find((e) => e._id === type);
    return formatWithCommas(earning?.totalEarning?.toFixed(2) || "0.00");
  };

  const fetchPercents = () => {
    axios.get("/get_percents").then((res) => {
      setPercents({ type: res.data?.type, percent: res.data?.percent });
    });
  };

  useEffect(() => {
    axios.get("/profile").then((res) => {
      setProfile(res.data);
    });
  }, []);

  useEffect(() => {
    fetchPercents();
  }, []);

  const generateRandomTimer = () => {
    const minutes = Math.floor(Math.random() * 11); // Random minutes between 0 and 10
    const seconds = Math.floor(Math.random() * 60); // Random seconds between 0 and 59
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Format as mm:ss
  };

  const maxMonitizationEarning = useMemo(() => {
    const maxEarning = Math.max(
      ...posts.map((post) => post.monitization_earning || 0)
    );
    return maxEarning;
  }, [posts]);

  const maxAdEarning = useMemo(() => {
    const maxEarning = Math.max(...posts.map((post) => post.ad_earning || 0));
    return maxEarning;
  }, [posts]);

  return (
    <div
      style={{
        background:
          "radial-gradient(103.89% 81.75% at 95.41% 106.34%, #EAF8EF 6%, rgba(234, 248, 239, 0) 79.68%), radial-gradient(297.85% 151.83% at -21.39% 8.81%, #FAF1F1 0%, #FAF1F1 15.29%, #F3EDF5 21.39%, #E5F0FA 40.79%)",
        height: "100vh",
        width: "100%",
      }}
      className="d-flex container-fluid m-0 p-0 overflow-y-scroll"
    >
      <div className="sidebar bg-white  d-flex flex-column  align-items-center pt-3 pb-2 gap-2">
        <i
          alt="Meta Business Suite"
          className="insight_logo"
          height="20"
          width="32"
          style={{
            backgroundImage:
              'url("https://static.xx.fbcdn.net/rsrc.php/v4/yN/r/L3wScqQk19b.png?_nc_eui2=AeFTij2TLB1MHu5kFblN2oQO4Ul9zHPQzs3hSX3Mc9DOzYiNO76rL2DZATonbdOP7_eA7cVbzMKCoLAp0K5aJG9l")',
            backgroundPosition: "-161px -535px",
            backgroundSize: "auto",
            width: "34px",
            height: "23px",
            backgroundRepeat: "no-repeat",
            display: "inline-block",
          }}
        ></i>

        <div className="user-logo mt-3">
          <div className="avatar-container">
            <div className="avatar">
              <img src={profile?.image} alt={profile?.name} />
            </div>
            <div className="icon">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                alt="Facebook icon"
              />
            </div>
          </div>
        </div>

        <div
          // className="scrollAble"
          style={{ height: "56vh" }}
        >
          <div className="d-flex flex-column  align-items-center gap-2 ">
            <button
              className={`btn px-2 ${activeIcon === "home" ? "active" : ""}`}
              onClick={() => handleIconClick("home")}
            >
              <img src={activeIcon === "home" ? home2 : home1} alt="Overview" />
            </button>
            <button
              className={`btn px-2 ${
                activeIcon === "notifications" ? "active" : ""
              }`}
              onClick={() => handleIconClick("notifications")}
            >
              <span className="position-relative ">
                <img
                  src={`${activeIcon === "notifications" ? bell2 : bell1}`}
                  alt=""
                />
                <span
                  style={{ top: "4px", padding: "3px", right: "0px" }}
                  class="position-absolute  start-100 translate-middle  bg-danger border border-light rounded-circle"
                >
                  <span class="visually-hidden">New alerts</span>
                </span>
              </span>
            </button>

            {/* <button
              className={`btn ${activeButton === "ads" ? "active" : ""}`}
              onClick={() => handleButtonClick("ads")}
            >
              <img src={ads} alt="" />
            </button> */}

            <button
              className={`btn px-2 ${activeIcon === "message" ? "active" : ""}`}
              onClick={() => handleIconClick("message")}
            >
              <span className="position-relative ">
                {/* <LuMessageCircle size={22} /> */}
                <img src={activeIcon === "message" ? inbox2 : inbox1} alt="" />
                <span
                  style={{ top: "2px", padding: "3px" }}
                  class="position-absolute  start-100 translate-middle  bg-danger border border-light rounded-circle"
                >
                  <span class="visually-hidden">New alerts</span>
                </span>
              </span>
            </button>
            <button
              className={`btn px-2 ${activeIcon === "copy" ? "active" : ""}`}
              onClick={() => handleIconClick("copy")}
            >
              <img src={activeIcon === "copy" ? content2 : content1} alt="" />
            </button>
            <button
              className={`btn px-2 ${activeIcon === "dock" ? "active" : ""}`}
              onClick={() => handleIconClick("dock")}
            >
              <img src={activeIcon === "dock" ? calender2 : calender1} alt="" />
            </button>

            <button
              className={`btn px-2 ${
                activeIcon === "speakerphone" ? "active" : ""
              }`}
              onClick={() => handleIconClick("speakerphone")}
            >
              <img
                src={activeIcon === "speakerphone" ? speaker2 : speaker1}
                alt=""
              />{" "}
            </button>
            <button
              className={`btn px-2 ${activeIcon === "insight" ? "active" : ""}`}
              onClick={() => handleIconClick("insight")}
            >
              <img
                src={activeIcon === "insight" ? insight2 : insight1}
                alt=""
              />{" "}
            </button>

            <button
              className={`btn px-2 ${activeIcon === "menu" ? "active" : ""}`}
              onClick={() => handleIconClick("menu")}
            >
              <img src={activeIcon === "menu" ? menu2 : menu1} alt="" />{" "}
            </button>
          </div>
          {/* <button
            className={`btn fw-semibold  mt-3 text-center ${
              activeIcon === "edit" ? "active" : ""
            }`}
            onClick={() => handleIconClick("edit")}
          >
            Edit
          </button> */}
        </div>

        <div className="d-flex flex-column  align-items-center position-absolute bottom-0 ">
          <button
            className={`btn px-2 fs-12 ${
              activeIcon === "search" ? "active" : ""
            }`}
            // onClick={() => handleIconClick("search")}
          >
            {/* <IoSearchOutline size={22} /> */}
            <i
              alt=""
              data-visualcompletion="css-img"
              class="img"
              style={{
                backgroundImage:
                  'url("https://static.xx.fbcdn.net/rsrc.php/v4/yX/r/FDPPbUhG9ct.png?_nc_eui2=AeEbXtqIkSoA9vXMxDGr2SmtR_QB3KhFljJH9AHcqEWWMi8JZUcdimlL8ZFuiuD9FJiPYTDTVuKY_W7f0s-5s7rY")',
                backgroundPosition: "-441px -401px",
                backgroundSize: "auto",
                width: "20px",
                height: "20px",
                backgroundRepeat: "no-repeat",
                display: "inline-block",
              }}
            ></i>
          </button>

          <button
            className={`btn px-2  ${activeIcon === "setting" ? "active" : ""}`}
            onClick={() => handleIconClick("setting")}
          >
            <img
              src={activeIcon === "setting" ? settings2 : settings1}
              alt=""
            />
          </button>
          <button
            className={`btn px-2  ${activeIcon === "help" ? "active" : ""}`}
            // onClick={() => handleIconClick("help")}
          >
            {/* <IoHelp size={20} /> */}
            <i
              alt=""
              data-visualcompletion="css-img"
              class="img mt-1"
              style={{
                backgroundImage:
                  'url("https://static.xx.fbcdn.net/rsrc.php/v4/yX/r/FDPPbUhG9ct.png?_nc_eui2=AeEbXtqIkSoA9vXMxDGr2SmtR_QB3KhFljJH9AHcqEWWMi8JZUcdimlL8ZFuiuD9FJiPYTDTVuKY_W7f0s-5s7rY")',
                backgroundPosition: "-462px -401px",
                backgroundSize: "auto",
                width: "20px",
                height: "20px",
                backgroundRepeat: "no-repeat",
                display: "inline-block",
              }}
            ></i>
          </button>
        </div>
      </div>

      <div className="content overflow-y-scroll" ref={scrollDivRef}>
        {/* navbar  */}
        <div
          className={`position-sticky w-100 top-0 z-index-10 pt-2 mb-3 ${
            scrolled ? "shodow-css" : ""
          }`}
          style={{
            background: scrolled ? "white" : "transparent",
            paddingBottom: scrolled ? "20px" : "0px",
            // marginBottom: scrolled ? "",
            transition: "all 0.2s linear",
          }}
        >
          <div className="d-flex justify-content-between align-items-center px-3">
            <div>
              <h5 className="fw-bold mb-0">Insights</h5>
              <p className="fs-14 m-0">Review performance results and more.</p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <div class="dropdown">
                  <button
                    class="btn py-2 insight_btn  dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    aria-expanded="false"
                  >
                    <FaFacebook
                      className="me-1"
                      size={18}
                      color="rgba(24, 119, 242, 1)"
                    />
                    Facebook
                  </button>
                </div>
                <div class="dropdown">
                  <button
                    class="btn insight_btn  dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    aria-expanded="false"
                  >
                    <div
                      className="xtwfq29"
                      style={{
                        width: "16px",
                        height: "16px",
                        maskImage:
                          'url("https://static.xx.fbcdn.net/rsrc.php/v4/yA/r/Zo3e4kSmwpr.png?_nc_eui2=AeF3aKGdkRuElSS8AHEtWxi07Fc_c18gnI_sVz9zXyCcj7nnL-UYQmnlL9dcR2oJyDp5lC0c8iq0nJyUBpKySm1C")',
                        WebkitMaskImage:
                          'url("https://static.xx.fbcdn.net/rsrc.php/v4/yA/r/Zo3e4kSmwpr.png?_nc_eui2=AeF3aKGdkRuElSS8AHEtWxi07Fc_c18gnI_sVz9zXyCcj7nnL-UYQmnlL9dcR2oJyDp5lC0c8iq0nJyUBpKySm1C")',
                        maskPosition: "0px -303px",
                        WebkitMaskPosition: "0px -303px",
                        backgroundColor: "black",
                      }}
                    ></div>
                    Export data
                    <span className="border_left"></span>
                  </button>
                </div>

                <div className="dropdown ">
                  <button
                    className="btn py-2 insight_btn  dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    aria-expanded={openDatePicker ? "true" : "false"}
                    onClick={toggleDatePicker}
                  >
                    <div
                      className="xtwfq29"
                      style={{
                        width: "16px",
                        height: "16px",
                        WebkitMaskImage:
                          'url("https://static.xx.fbcdn.net/rsrc.php/v4/yh/r/eHiV0Aq3-LC.png?_nc_eui2=AeETZbnxGlHep7j3aReYv1MVvUdT5naLG9W9R1Pmdosb1QmLo13PIw0uKaKijXuLzBs5MJ65lmYrNnixwJ8ekMRo")',
                        maskImage:
                          'url("https://static.xx.fbcdn.net/rsrc.php/v4/yh/r/eHiV0Aq3-LC.png?_nc_eui2=AeETZbnxGlHep7j3aReYv1MVvUdT5naLG9W9R1Pmdosb1QmLo13PIw0uKaKijXuLzBs5MJ65lmYrNnixwJ8ekMRo")',
                        maskPosition: "0px -249px",
                        WebkitMaskPosition: "0px -249px",
                        backgroundColor: "black",
                      }}
                    ></div>
                    {customRange !== "custom" &&
                      `${formatLabel(customRange)}: `}
                    {`${moment(selectedRange.startDate).format(
                      "MMM DD, YYYY"
                    )} - ${moment(selectedRange.endDate).format(
                      "MMM DD, YYYY"
                    )}`}
                  </button>
                </div>
              </div>

              <div className="user-logo ">
                <div className="avatar-container">
                  <div
                    style={{ width: "40px", height: "40px" }}
                    className="bg-white rounded-circle  d-flex align-items-center justify-content-center"
                  >
                    <div className="avatar user_profile">
                      {profile?.image ? (
                        <img
                          src={profile.image}
                          alt={`${profile?.name}'s profile`}
                        />
                      ) : (
                        <span>{profile?.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  <div className="icon">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                      alt="Facebook icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="z-index-10">
            <DateRange
              show={openDatePicker}
              onRangeSelect={handleRangeSelect}
              onHide={() => setOpenDatePicker(false)}
            />
          </div>
        </div>
        {/* ///// */}
        <div className="d-flex mt-2  gap-3 px-3 z-index-1 position-relative">
          <div
            className={`inside_scroll ps-2`}
            style={{
              width: isCollapsed ? "5%" : "15%",
              transition: "width 0.3s ease-in-out",
            }}
          >
            <div
              className={`d-flex flex-column scrollAble sidebar-container ${
                scrolled && "pt-3"
              }`}
              style={{
                height: "72vh",
                transition: "all 0.3s linear",
              }}
            >
              <button
                className={`btn mb-1 d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "overview" ? "active" : ""}`}
                onClick={() => handleButtonClick("overview")}
              >
                <img
                  src={activeButton === "overview" ? whiteOverview : overview}
                  alt="Overview"
                />
                {!isCollapsed && (
                  <span className="fs-14 fw-bold">Overview</span>
                )}
              </button>

              <button
                className={`btn mb-1 d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "plan" ? "active" : ""}`}
                onClick={() => handleButtonClick("plan")}
              >
                <img
                  src={activeButton === "plan" ? whitePlan : plan}
                  alt="Plan"
                />
                {!isCollapsed && <span className="fs-14 fw-bold">Plan</span>}
              </button>

              <button
                className={`btn mb-1  d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "result" ? "active" : ""}`}
                onClick={() => handleButtonClick("result")}
              >
                <img
                  src={activeButton === "result" ? whiteResult : result}
                  alt="Results"
                />
                {!isCollapsed && <span className="fs-14 fw-bold">Results</span>}
              </button>

              <button
                className={`btn mb-1  d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "audience" ? "active" : ""}`}
                onClick={() => handleButtonClick("audience")}
              >
                <img
                  src={activeButton === "audience" ? whiteAudience : audience}
                  alt="Audience"
                />
                {!isCollapsed && (
                  <span className="fs-14 fw-bold">Audience</span>
                )}
              </button>

              <button
                className={`btn mb-1  d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "messaging" ? "active" : ""}`}
                onClick={() => handleButtonClick("messaging")}
              >
                <img
                  src={activeButton === "messaging" ? whiteMessage : message}
                  alt="Messaging"
                />
                {!isCollapsed && (
                  <span className="fs-14 fw-bold">Messaging</span>
                )}
              </button>

              <button
                className={`btn mb-1  d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "bench" ? "active" : ""}`}
                onClick={() => handleButtonClick("bench")}
              >
                <img
                  src={activeButton === "bench" ? whiteBench : bench}
                  alt="BenchMarking"
                />
                {!isCollapsed && (
                  <span className="fs-14 fw-bold">BenchMarking</span>
                )}
              </button>

              <p className="fs-12 text-muted mt-2 ms-3 mb-1">
                {!isCollapsed ? "Content" : "•"}
              </p>

              <button
                className={`btn mb-1   d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "overview2" ? "active" : ""}`}
                onClick={() => handleButtonClick("overview2")}
              >
                <img
                  src={
                    activeButton === "overview2" ? whiteOVerview2 : overview2
                  }
                  alt="Overview"
                />
                {!isCollapsed && (
                  <span className="fs-14 fw-bold">Overview</span>
                )}
              </button>

              <button
                className={`btn mb-1  d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "content" ? "active" : ""}`}
                onClick={() => handleButtonClick("content")}
              >
                <img
                  src={activeButton === "content" ? whiteContent : content}
                  alt="Content"
                />
                {!isCollapsed && <span className="fs-14 fw-bold">Content</span>}
              </button>

              <p className="fs-12 text-muted mt-2 ms-3 mb-1">
                {!isCollapsed ? "Earnings" : "•"}
              </p>

              <button
                className={`btn mb-1 d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "earnings" ? "active" : ""}`}
                onClick={() => handleButtonClick("earnings")}
              >
                <img
                  src={activeButton === "earnings" ? whiteEarning : earning}
                  alt="Earnings"
                />
                {!isCollapsed && (
                  <span className="fs-14 fw-bold">Earnings</span>
                )}
              </button>

              <button
                className={`btn mb-1 d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "subs" ? "active" : ""}`}
                onClick={() => handleButtonClick("subs")}
              >
                <img
                  src={activeButton === "subs" ? whiteSubs : subs}
                  alt="Subscription"
                />
                {!isCollapsed && (
                  <span className="fs-14 fw-bold">Subscription</span>
                )}
              </button>
            </div>
            <div
              className={`py-3 ps-2 pe-3 mt-3 d-flex align-items-center ${
                isCollapsed
                  ? "justify-content-center"
                  : "justify-content-end w-100"
              }`}
            >
              {isCollapsed ? (
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Expand"
                  onClick={toggleCollapse}
                  style={{
                    cursor: "pointer",
                    backgroundImage:
                      'url("https://static.xx.fbcdn.net/rsrc.php/v4/yh/r/eHiV0Aq3-LC.png?_nc_eui2=AeETZbnxGlHep7j3aReYv1MVvUdT5naLG9W9R1Pmdosb1QmLo13PIw0uKaKijXuLzBs5MJ65lmYrNnixwJ8ekMRo")',
                    backgroundPosition: "-105px -207px",
                    backgroundSize: "auto",
                    width: "20px",
                    height: "20px",
                    backgroundRepeat: "no-repeat",
                    display: "inline-block",
                  }}
                ></i>
              ) : (
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Collapse"
                  onClick={toggleCollapse}
                  style={{
                    cursor: "pointer",
                    backgroundImage:
                      'url("https://static.xx.fbcdn.net/rsrc.php/v4/yh/r/eHiV0Aq3-LC.png?_nc_eui2=AeETZbnxGlHep7j3aReYv1MVvUdT5naLG9W9R1Pmdosb1QmLo13PIw0uKaKijXuLzBs5MJ65lmYrNnixwJ8ekMRo")',
                    backgroundPosition: "-84px -207px",
                    backgroundSize: "auto",
                    width: "20px",
                    height: "20px",
                    backgroundRepeat: "no-repeat",
                    display: "inline-block",
                  }}
                ></i>
                // <img src={sidebar_open} alt="" />
              )}
            </div>
          </div>
          <div className="main-scroll">
            <div className="mb-2 bg-white shadow-sm rounded py-2 px-3 overflow-auto pb-5 ">
              {/* <div className="d-flex justify-content-between"> */}
              {loading ? (
                <div
                  className="p-2 rounded mt-2"
                  style={{
                    backgroundColor: "#f0f0f0",
                    height: "20px",
                    width: "18%",
                  }}
                ></div>
              ) : (
                <p className="fw-semibold mt-2 fs-14">Earnings</p>
              )}
              {/* <div class="dropdown">
                  <button
                    class="btn py-2 insight_btn fw-semibold dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    aria-expanded="false"
                  >
                    <div
                      class="xtwfq29"
                      style={{
                        width: "16px",
                        height: "16px",
                        maskImage:
                          'url("https://static.xx.fbcdn.net/rsrc.php/v4/yU/r/G7bxwD_Jn8u.png?_nc_eui2=AeE1z3qJp1XqC3BM07EvLzX2c47xzM8uX-ZzjvHMzy5f5jPC8_WRDTIK3w2IZi_81sHbXwSBvnDiPKWFkFvFMlhI")',
                        WebkitMaskImage:
                          'url("https://static.xx.fbcdn.net/rsrc.php/v4/yU/r/G7bxwD_Jn8u.png?_nc_eui2=AeE1z3qJp1XqC3BM07EvLzX2c47xzM8uX-ZzjvHMzy5f5jPC8_WRDTIK3w2IZi_81sHbXwSBvnDiPKWFkFvFMlhI")', // For WebKit browsers
                        maskPosition: "0px -909px",

                        WebkitMaskPosition: "0px -909px",
                        backgroundColor: "black",
                      }}
                    ></div>
                    Export
                  </button>
                </div>{" "} */}
              {/* </div> */}
              {loading ? (
                <div
                  className="p-2 rounded "
                  style={{
                    backgroundColor: "#f0f0f0",
                    height: "35px",
                    width: "18%",
                  }}
                ></div>
              ) : (
                <button className="btn monetization_btn fs-14">
                  Content monetization
                </button>
              )}

              {loading ? (
                <div
                  className="p-2 rounded mt-4"
                  style={{
                    backgroundColor: "#f0f0f0",
                    height: "100px",
                    width: "22%",
                  }}
                ></div>
              ) : (
                <div className="d-flex gap-3  mt-4 ">
                  <div
                    onClick={() => setEarningTab("total")}
                    className={`p-2 rounded cursor-pointer ${
                      earningTab === "total" && "earning-border"
                    }`}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <span className="fw-bold fs-14">
                        Total approximate earnings
                      </span>
                      <div
                        class="cursor-pointer"
                        style={{
                          width: "12px",
                          height: "12px",
                          maskImage:
                            'url("https://static.xx.fbcdn.net/rsrc.php/v4/yO/r/nxzRwdoCPVt.png?_nc_eui2=AeGAASZmAX5jIWq4dreRZ-JonHgC_sjDtSaceAL-yMO1JpoPrb8NuTw9W3xtlxgsew1Sj8KTrwKd1n1deevFeWvy")',
                          maskPosition: "0px -1435px",
                          WebkitMaskImage:
                            'url("https://static.xx.fbcdn.net/rsrc.php/v4/yO/r/nxzRwdoCPVt.png?_nc_eui2=AeGAASZmAX5jIWq4dreRZ-JonHgC_sjDtSaceAL-yMO1JpoPrb8NuTw9W3xtlxgsew1Sj8KTrwKd1n1deevFeWvy")', // For WebKit browsers
                          WebkitMaskPosition: "0px -1435px",
                          backgroundColor: "black",
                        }}
                      ></div>
                    </div>
                    <div className="d-flex gap-1 mb-4">
                      <p className="fs-2 mb-0 dark-text ">
                        ${formatWithCommas(totalEarning)}
                      </p>
                      {percents.type === "green" ? (
                        <div className="mt-3 d-flex align-items-center ">
                          <HiArrowNarrowDown color="rgba(115,0,15,1)" />

                          <span
                            style={{
                              color: "rgba(115,0,15,1)",
                              fontWeight: 500,
                              // textDecoration: "dashed",
                            }}
                          >
                            {percents.percent?.toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <div className="mt-3 d-flex align-items-center ">
                          <HiArrowNarrowUp color="rgb(73 178 148)" />

                          <span
                            style={{
                              color: "rgb(73 178 148)",
                              textDecoration: "underline",
                              fontWeight: 500,
                            }}
                          >
                            {percents.percent?.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    onClick={() => setEarningTab("video")}
                    className={`p-2 rounded cursor-pointer ${
                      earningTab === "video" && "earning-border"
                    }`}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <span className="fw-bold fs-14">Videos</span>
                      <div
                        class="cursor-pointer"
                        style={{
                          width: "12px",
                          height: "12px",
                          maskImage:
                            'url("https://static.xx.fbcdn.net/rsrc.php/v4/yO/r/nxzRwdoCPVt.png?_nc_eui2=AeGAASZmAX5jIWq4dreRZ-JonHgC_sjDtSaceAL-yMO1JpoPrb8NuTw9W3xtlxgsew1Sj8KTrwKd1n1deevFeWvy")',
                          maskPosition: "0px -1435px",
                          WebkitMaskImage:
                            'url("https://static.xx.fbcdn.net/rsrc.php/v4/yO/r/nxzRwdoCPVt.png?_nc_eui2=AeGAASZmAX5jIWq4dreRZ-JonHgC_sjDtSaceAL-yMO1JpoPrb8NuTw9W3xtlxgsew1Sj8KTrwKd1n1deevFeWvy")', // For WebKit browsers
                          WebkitMaskPosition: "0px -1435px",
                          backgroundColor: "black",
                        }}
                      ></div>
                    </div>
                    <div className="d-flex gap-1 mb-4">
                      <p className="fs-2 mb-0 dark-text ">
                        ${getTypeEarning("video")}
                      </p>
                      <div className="d-grid align-content-center">
                        <div className="small-line"></div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setEarningTab("reel")}
                    className={`p-2 rounded cursor-pointer ${
                      earningTab === "reel" && "earning-border"
                    }`}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <span className="fw-bold fs-14">Reels</span>
                      <div
                        class="cursor-pointer"
                        style={{
                          width: "12px",
                          height: "12px",
                          maskImage:
                            'url("https://static.xx.fbcdn.net/rsrc.php/v4/yO/r/nxzRwdoCPVt.png?_nc_eui2=AeGAASZmAX5jIWq4dreRZ-JonHgC_sjDtSaceAL-yMO1JpoPrb8NuTw9W3xtlxgsew1Sj8KTrwKd1n1deevFeWvy")',
                          maskPosition: "0px -1435px",
                          WebkitMaskImage:
                            'url("https://static.xx.fbcdn.net/rsrc.php/v4/yO/r/nxzRwdoCPVt.png?_nc_eui2=AeGAASZmAX5jIWq4dreRZ-JonHgC_sjDtSaceAL-yMO1JpoPrb8NuTw9W3xtlxgsew1Sj8KTrwKd1n1deevFeWvy")', // For WebKit browsers
                          WebkitMaskPosition: "0px -1435px",
                          backgroundColor: "black",
                        }}
                      ></div>
                    </div>
                    <div className="d-flex gap-1 mb-4">
                      <p className="fs-2 mb-0 dark-text">
                        ${getTypeEarning("reel")}
                      </p>
                      <div className="d-grid align-content-center">
                        <div className="small-line"></div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setEarningTab("photo_text")}
                    className={`p-2 rounded cursor-pointer ${
                      earningTab === "photo_text" && "earning-border"
                    }`}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <span className="fw-bold fs-14">Photo and text</span>
                      <div
                        class="cursor-pointer"
                        style={{
                          width: "12px",
                          height: "12px",
                          maskImage:
                            'url("https://static.xx.fbcdn.net/rsrc.php/v4/yO/r/nxzRwdoCPVt.png?_nc_eui2=AeGAASZmAX5jIWq4dreRZ-JonHgC_sjDtSaceAL-yMO1JpoPrb8NuTw9W3xtlxgsew1Sj8KTrwKd1n1deevFeWvy")',
                          maskPosition: "0px -1435px",
                          WebkitMaskImage:
                            'url("https://static.xx.fbcdn.net/rsrc.php/v4/yO/r/nxzRwdoCPVt.png?_nc_eui2=AeGAASZmAX5jIWq4dreRZ-JonHgC_sjDtSaceAL-yMO1JpoPrb8NuTw9W3xtlxgsew1Sj8KTrwKd1n1deevFeWvy")', // For WebKit browsers
                          WebkitMaskPosition: "0px -1435px",
                          backgroundColor: "black",
                        }}
                      ></div>
                    </div>
                    <div className="d-flex gap-1 mb-4">
                      <p className="fs-2 mb-0 dark-text">
                        ${getTypeEarning("photo_text")}
                      </p>
                      <div className="d-grid align-content-center">
                        <div className="small-line"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4">
                {loading ? (
                  <div
                    className="p-2 rounded mt-4"
                    style={{ backgroundColor: "#f0f0f0", height: "200px" }}
                  ></div>
                ) : (
                  <LineGraph
                    posts={posts}
                    startDate={selectedRange.startDate}
                    endDate={selectedRange.endDate}
                    type={earningTab}
                  />
                )}
              </div>
            </div>
            <div className="mb-2 bg-white shadow-sm rounded py-2 px-3 overflow-hidden">
              <p className="fw-semibold mt-2 mb-0">Top performers</p>
              <button className="btn monetization_btn fs-14 mt-3">
                Top videos
              </button>
              <div
                style={{
                  overflowX: "auto",
                  width: "74vw",
                  paddingBottom: "5rem",
                  whiteSpace: "nowrap",
                }}
              >
                <table
                  className="table mt-4 "
                  style={{
                    tableLayout: "fixed",
                    width: "max-content",
                    minWidth: "100%",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        className="fs-14 "
                        style={{
                          width: "60%",
                          verticalAlign: "middle",
                          minWidth: "300px",
                        }}
                      >
                        Title
                      </th>
                      <th
                        style={{
                          width: "20%",
                          verticalAlign: "middle",
                          minWidth: "150px",
                        }}
                        className="fs-14 "
                      >
                        <div className="d-flex align-items-center gap-1">
                          <span> Date Published</span>
                          <div
                            type="button"
                            data-bs-toggle="popover"
                            data-bs-trigger="hover"
                            data-bs-placement="top"
                            data-bs-content="Unsorted"
                            style={{
                              width: "16px",
                              height: "16px",
                              maskImage:
                                'url("https://static.xx.fbcdn.net/rsrc.php/v4/y5/r/G75SpNrMy6K.png?_nc_eui2=AeEy-cVrTmb1Dd7ivcewl0Qa1uS1bs_Cb6bW5LVuz8JvpjsE9y9N3pBROu4krOwMhzGlSOWL4KoMTVBDC9lDdWsV")',
                              maskPosition: "0px -807px",
                              backgroundColor: "black",
                            }}
                          ></div>
                        </div>
                      </th>
                      <th
                        style={{
                          width: "16%",
                          verticalAlign: "middle",
                          minWidth: "150px",
                        }}
                        className="fs-14 "
                      >
                        <div className="d-flex align-items-center gap-1">
                          <span
                            type="button"
                            data-bs-toggle="popover"
                            data-bs-trigger="hover"
                            data-bs-placement="top"
                            data-bs-content="Approximate content monetization earnings"
                          >
                            {" "}
                            Approximate...
                          </span>

                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              maskImage:
                                'url("https://static.xx.fbcdn.net/rsrc.php/v4/y8/r/nW2Xp0vInax.png?_nc_eui2=AeHpW0sTWciNs7fdnAABI6iOYAKIbFohYyJgAohsWiFjIgsXOtwPlg8sBy74TOEfh6YCVqizlU19vTMiQG53aM10")',
                              maskPosition: "0px -1452px",
                              backgroundColor: "black",
                            }}
                          ></div>
                          <div
                            type="button"
                            data-bs-toggle="popover"
                            data-bs-trigger="hover"
                            data-bs-placement="top"
                            data-bs-content="Sorted decending"
                            style={{
                              width: "16px",
                              height: "16px",
                              maskImage:
                                'url("https://static.xx.fbcdn.net/rsrc.php/v4/yt/r/17uMltFZpDR.png?_nc_eui2=AeF1cb1eTMylzQHTJ_nqQKQfsczgJ4AOghixzOAngA6CGFMRbBO7_6f051HsCFunydPIylhg8Cn1DTAZR2pNsIKf")',
                              maskPosition: "-17px -497px",
                              WebkitMaskImage:
                                'url("https://static.xx.fbcdn.net/rsrc.php/v4/yt/r/17uMltFZpDR.png?_nc_eui2=AeF1cb1eTMylzQHTJ_nqQKQfsczgJ4AOghixzOAngA6CGFMRbBO7_6f051HsCFunydPIylhg8Cn1DTAZR2pNsIKf")', // For WebKit browsers
                              WebkitMaskPosition: "-17px -497px",
                              backgroundColor: "rgba(10, 120, 190, 1)",
                            }}
                          ></div>
                        </div>
                      </th>
                      <th
                        style={{ width: "16%", verticalAlign: "middle" }}
                        className="fs-14 "
                      >
                        <div className="d-flex align-items-center gap-1">
                          <span
                            type="button"
                            data-bs-toggle="popover"
                            data-bs-trigger="hover"
                            data-bs-placement="top"
                            data-bs-content="Approximate in-stream ad earnings"
                          >
                            {" "}
                            Approximate...
                          </span>

                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              maskImage:
                                'url("https://static.xx.fbcdn.net/rsrc.php/v4/y8/r/nW2Xp0vInax.png?_nc_eui2=AeHpW0sTWciNs7fdnAABI6iOYAKIbFohYyJgAohsWiFjIgsXOtwPlg8sBy74TOEfh6YCVqizlU19vTMiQG53aM10")',
                              maskPosition: "0px -1452px",
                              backgroundColor: "black",
                            }}
                          ></div>
                          <div
                            type="button"
                            data-bs-toggle="popover"
                            data-bs-trigger="hover"
                            data-bs-placement="top"
                            data-bs-content="Unsorted"
                            style={{
                              width: "16px",
                              height: "16px",
                              maskImage:
                                'url("https://static.xx.fbcdn.net/rsrc.php/v4/y5/r/G75SpNrMy6K.png?_nc_eui2=AeEy-cVrTmb1Dd7ivcewl0Qa1uS1bs_Cb6bW5LVuz8JvpjsE9y9N3pBROu4krOwMhzGlSOWL4KoMTVBDC9lDdWsV")',
                              maskPosition: "0px -807px",
                              backgroundColor: "black",
                            }}
                          ></div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts
                      ?.sort(
                        (a, b) =>
                          b.monitization_earning - a.monitization_earning
                      )
                      ?.map((post, i) => (
                        <tr>
                          <td>
                            <div className="d-flex align-items-center gap-3 justify-content-between">
                              <div className="d-flex align-items-center gap-3">
                                <div className="user-logo">
                                  <div className="avatar-container">
                                    <div className="top_video_img">
                                      <img src={post.image} alt="John Doe" />
                                      {(post.type === "video" ||
                                        post.type === "reel") && (
                                        <div className="video_overlay">
                                          {generateRandomTimer()}
                                        </div>
                                      )}
                                    </div>
                                    <div className="icon">
                                      <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                        alt="Facebook icon"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <p className="mb-0 fs-14 ellipse-text">
                                    {post?.title}
                                  </p>
                                  <div className="d-flex align-items-center gap-2">
                                    {post?.type === "video" ? (
                                      <div className="d-flex align-items-center gap-2">
                                        <div
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            maskImage:
                                              'url("https://static.xx.fbcdn.net/rsrc.php/v4/yl/r/bQm8iKosY8H.png?_nc_eui2=AeHS29bYkIidXuiw8HaJ5jnDNAd7AkRi5Bc0B3sCRGLkF8pIAJRI0O9gviGRhYO_GDbU50YRz205BUDamTErMv_L")',
                                            maskPosition: "0px -347px",
                                            backgroundColor: "rgba(40,57,67,1)",
                                          }}
                                        ></div>{" "}
                                        <span className="fs-14">Video .</span>
                                      </div>
                                    ) : post?.type === "reel" ? (
                                      <div className="d-flex align-items-center gap-2">
                                        <div
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            maskImage:
                                              'url("https://static.xx.fbcdn.net/rsrc.php/v4/yN/r/tk5v7ZdBARp.png")',
                                            maskPosition: "0px -304px",
                                            backgroundColor: "rgba(40,57,67,1)",
                                          }}
                                        ></div>{" "}
                                        <span className="fs-14">Reel .</span>
                                      </div>
                                    ) : (
                                      <div className="d-flex align-items-center gap-2">
                                        <div
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            maskImage:
                                              'url("https://static.xx.fbcdn.net/rsrc.php/v4/y_/r/v24ZDV3LHyJ.png")',
                                            maskPosition: "0px -737px",
                                            backgroundColor: "rgba(40,57,67,1)",
                                          }}
                                        ></div>{" "}
                                        <span className="fs-14">Photo .</span>
                                      </div>
                                    )}

                                    <div className="d-flex align-items-center gap-2">
                                      <img
                                        src={profile?.image}
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          objectFit: "cover",
                                          borderRadius: "50%",
                                        }}
                                        alt=""
                                      />
                                      <span className="fs-12 mb-1">
                                        {profile?.name}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button
                                class="btn fs-13 insight_btn fw-semibold  d-flex align-items-center gap-2 px-3 fs-14"
                                type="button"
                                style={{ height: "2.2rem" }}
                              >
                                View insights
                              </button>
                            </div>
                          </td>
                          <td
                            className="fs-14 "
                            style={{ verticalAlign: "middle" }}
                          >
                            {moment(post.datePublished).format("ddd MMM DD")}
                          </td>
                          <td
                            className="fs-14 "
                            style={{ verticalAlign: "middle" }}
                          >
                            <span>
                              {" "}
                              $
                              {post?.monitization_earning?.toFixed(2) ||
                                "0.00"}{" "}
                            </span>
                            <div
                              class="progress"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow="50"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <div
                                class="progress-bar"
                                style={{
                                  width: `${
                                    (post?.monitization_earning /
                                      maxMonitizationEarning) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>{" "}
                          </td>
                          <td
                            className="fs-14 "
                            style={{ verticalAlign: "middle" }}
                          >
                            <span>
                              {" "}
                              ${post?.ad_earning?.toFixed(2) || "0.00"}{" "}
                            </span>
                            <div
                              class="progress"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow="100"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <div
                                class="progress-bar"
                                style={{
                                  width: `${
                                    (post?.ad_earning / maxAdEarning) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>{" "}
                          </td>
                        </tr>
                      ))}
                    {/* 
                    <tr>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="user-logo">
                              <div className="avatar-container">
                                <div className="top_video_img">
                                  <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3xMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                                    alt="John Doe"
                                  />
                                </div>
                                <div className="icon">
                                  <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                    alt="Facebook icon"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="mb-0 fs-14">
                                stan Laurel and Oliver Hardy #hardy #sta...
                              </p>
                              <div className="d-flex align-items-center gap-2">
                                <div className="d-flex align-items-center gap-2">
                                  <div
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                      maskImage:
                                        'url("https://static.xx.fbcdn.net/rsrc.php/v4/yl/r/bQm8iKosY8H.png?_nc_eui2=AeHS29bYkIidXuiw8HaJ5jnDNAd7AkRi5Bc0B3sCRGLkF8pIAJRI0O9gviGRhYO_GDbU50YRz205BUDamTErMv_L")',
                                      maskPosition: "0px -347px",
                                      backgroundColor: "rgba(40,57,67,1)",
                                    }}
                                  ></div>{" "}
                                  <span className="fs-14 mb-1">video .</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={userImg}
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      objectFit: "cover",
                                      borderRadius: "50%",
                                    }}
                                    alt=""
                                  />
                                  <span className="fs-12 mb-1">muni video</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            class="btn fs-13 insight_btn fw-semibold  d-flex align-items-center gap-2 px-3 fs-14"
                            type="button"
                            style={{ height: "2.2rem" }}
                          >
                            View insights
                          </button>
                        </div>
                      </td>
                      <td
                        className="fs-14 "
                        style={{ verticalAlign: "middle" }}
                      >
                        Sat Nov 23, 11:15am
                      </td>
                      <td
                        className="fs-14 "
                        style={{ verticalAlign: "middle" }}
                      >
                        <span> {"< $0.01"} </span>
                        <div
                          class="progress"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            class="progress-bar"
                            style={{ width: "50%" }}
                          ></div>
                        </div>{" "}
                      </td>
                      <td
                        className="fs-14 "
                        style={{ verticalAlign: "middle" }}
                      >
                        <span> {"< $0.00"} </span>
                        <div
                          class="progress"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            class="progress-bar"
                            style={{ width: "0%" }}
                          ></div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="user-logo">
                              <div className="avatar-container">
                                <div className="top_video_img">
                                  <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3xMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                                    alt="John Doe"
                                  />
                                </div>
                                <div className="icon">
                                  <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                    alt="Facebook icon"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="mb-0 fs-14">
                                stan Laurel and Oliver Hardy #hardy #sta...
                              </p>
                              <div className="d-flex align-items-center gap-2">
                                <div className="d-flex align-items-center gap-2">
                                  <div
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                      maskImage:
                                        'url("https://static.xx.fbcdn.net/rsrc.php/v4/yl/r/bQm8iKosY8H.png?_nc_eui2=AeHS29bYkIidXuiw8HaJ5jnDNAd7AkRi5Bc0B3sCRGLkF8pIAJRI0O9gviGRhYO_GDbU50YRz205BUDamTErMv_L")',
                                      maskPosition: "0px -347px",
                                      backgroundColor: "rgba(40,57,67,1)",
                                    }}
                                  ></div>{" "}
                                  <span className="fs-14 mb-1">video .</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={userImg}
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      objectFit: "cover",
                                      borderRadius: "50%",
                                    }}
                                    alt=""
                                  />
                                  <span className="fs-12 mb-1">muni video</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            class="btn fs-13  insight_btn fw-semibold  d-flex align-items-center gap-2 px-3 fs-14"
                            type="button"
                            style={{ height: "2.2rem" }}
                          >
                            View insights
                          </button>
                        </div>
                      </td>
                      <td
                        className="fs-14 "
                        style={{ verticalAlign: "middle" }}
                      >
                        Sat Nov 23, 11:15am
                      </td>
                      <td
                        className="fs-14 "
                        style={{ verticalAlign: "middle" }}
                      >
                        <span> {"< $0.01"} </span>
                        <div
                          class="progress"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            class="progress-bar"
                            style={{ width: "20%" }}
                          ></div>
                        </div>{" "}
                      </td>
                      <td
                        className="fs-14 "
                        style={{ verticalAlign: "middle" }}
                      >
                        <span> {"< $0.00"} </span>
                        <div
                          class="progress"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            class="progress-bar"
                            style={{ width: "0%" }}
                          ></div>
                        </div>{" "}
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
