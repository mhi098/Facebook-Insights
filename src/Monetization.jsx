import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/js/bootstrap.min.js";
import * as bootstrap from "bootstrap";

// images
import overview from "./assets/overview.png";
import whiteOverview from "./assets/white-review.png";
import subs from "./assets/desc.png";
import whiteSubs from "./assets/white-subs.png";
import userImg from "./assets/user.jpg";
import add1 from "./assets/blackAds.png";
import add2 from "./assets/whiteAds.png";
import monetization1 from "./assets/blackMonetization.png";
import monetization2 from "./assets/whiteMonetization.png";
import star1 from "./assets/blackStar.png";
import star2 from "./assets/whiteStar.png";
import content1 from "./assets/blackBranded.png";
import content2 from "./assets/whiteBranding.png";
import policy1 from "./assets/blackPolicy.png";
import policy2 from "./assets/whitePolicy.png";
import home1 from "./assets/home-bl.png";
import home2 from "./assets/home-wh.png";
import bell1 from "./assets/bell-bl.png";
import bell2 from "./assets/bell-wh.png";
import inbox1 from "./assets/inbox-bl.png";
import inbox2 from "./assets/inbox-wh.png";
import calender1 from "./assets/calendr-bl.png";
import calender2 from "./assets/calendr-wh.png";
import contentBlack from "./assets/content2.png";
import contentwhite from "./assets/content-wh.png";
import speaker1 from "./assets/speaker-bl.png";
import speaker2 from "./assets/speaker-wh.png";
import menu1 from "./assets/menu-bl.png";
import menu2 from "./assets/menu-wh.png";

import settings1 from "./assets/setting-bl.png";
import settings2 from "./assets/setting-wh.png";
import insight1 from "./assets/insight.bl.png";
import insight2 from "./assets/insight-wh.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatNumber } from "./utils/numberHandler";

const Monetization = () => {
  const [profile, setProfile] = useState(null);
  const [totalEarning, setTotalEarning] = useState("0.00");
  const [activeButton, setActiveButton] = useState("monetization");
  const [activeIcon, setActiveIcon] = useState("insight");

  const [isCollapsed, setIsCollapsed] = useState(false);

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
    axios.get("/profile").then((res) => {
      setProfile(res.data);
    });
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

  const getStartAndEndDate = () => {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 28);

    return {
      startDate: startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      endDate: currentDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
    };
  };

  useEffect(() => {
    const { startDate, endDate } = getStartAndEndDate();
    axios
      .get(`/earnings/get_by_dates?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => {
        setTotalEarning(res.data?.overallEarnings?.toFixed(2) || "0.00");
      });
  }, []);

  return (
    <div
      style={{
        background:
          "radial-gradient(103.89% 81.75% at 95.41% 106.34%, #EAF8EF 6%, rgba(234, 248, 239, 0) 79.68%), radial-gradient(297.85% 151.83% at -21.39% 8.81%, #FAF1F1 0%, #FAF1F1 15.29%, #F3EDF5 21.39%, #E5F0FA 40.79%)",
        height: "100vh",
        width: "100%",
      }}
      className="d-flex container-fluid m-0 p-0 "
    >
      <div className="sidebar bg-white  d-flex flex-column  align-items-center pt-3 pb-2 gap-2 ">
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
              {profile?.image ? (
                <img src={profile?.image} alt={profile?.name} />
              ) : (
                <span>{profile?.name.charAt(0).toUpperCase()}</span>
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
              <img
                src={activeIcon === "copy" ? contentwhite : contentBlack}
                alt=""
              />
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

      <div className="content ">
        {/* navbar  */}
        <div className="position-sticky w-100 top-0  z-index-10 pt-2">
          <div className="d-flex justify-content-between align-items-center px-3">
            <div>
              <h5 className="fw-bold mb-0">Monetization</h5>
              <p className="fs-14">
                Get an overview of your current monetization products, see
                insights, manage available tasks, and onboard to new products.
              </p>
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
                        alt={`${profile.name}'s profile`}
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
        {/* ///// */}
        <div className="d-flex mt-2  gap-4 px-3 z-index-1">
          <div
            className="inside_scroll ps-2"
            style={{
              width: isCollapsed ? "5%" : "17%",
              transition: "width 0.3s ease-in-out",
            }}
          >
            <div
              className="d-flex flex-column  "
              // style={{
              //   height: "70vh",
              //   transition: "height 0.3s ease-in-out",
              // }}
            >
              <button
                className={`btn mb-1 fw-semibold d-flex align-items-center ${
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
                {!isCollapsed && <span>Overview</span>}
              </button>

              <button
                className={`btn mb-1 fw-semibold d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "instreamAds" ? "active" : ""}`}
                onClick={() => handleButtonClick("instreamAds")}
              >
                <img
                  src={activeButton === "instreamAds" ? add2 : add1}
                  alt="instreamAds"
                />
                {!isCollapsed && <span>In-stream Ads</span>}
              </button>

              <button
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Content monetization"
                className={`btn mb-1 fw-semibold d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "monetization" ? "active" : ""}`}
                onClick={() => handleButtonClick("monetization")}
              >
                <img
                  src={
                    activeButton === "monetization"
                      ? monetization2
                      : monetization1
                  }
                  alt="monetization"
                />
                {!isCollapsed && <span>Content monet...</span>}
              </button>

              <button
                className={`btn mb-1 fw-semibold d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "stars" ? "active" : ""}`}
                onClick={() => handleButtonClick("stars")}
              >
                <img
                  src={activeButton === "stars" ? star2 : star1}
                  alt="Stars"
                />
                {!isCollapsed && <span>Stars</span>}
              </button>

              <button
                className={`btn mb-1 fw-semibold d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "brandedContent" ? "active" : ""}`}
                onClick={() => handleButtonClick("brandedContent")}
              >
                <img
                  src={activeButton === "brandedContent" ? content2 : content1}
                  alt="BrandedContent"
                />
                {!isCollapsed && <span>Branded Content</span>}
              </button>
              <button
                className={`btn mb-1 fw-semibold d-flex align-items-center  ${
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
                {!isCollapsed && <span>Subscription</span>}
              </button>

              <button
                className={`mt-4 btn mb-1 fw-semibold d-flex align-items-center  ${
                  isCollapsed
                    ? "justify-content-center"
                    : "justify-content-start"
                } gap-2 ${activeButton === "policy" ? "active" : ""}`}
                onClick={() => handleButtonClick("policy")}
              >
                <img
                  src={activeButton === "policy" ? policy2 : policy1}
                  alt="Policy"
                />
                {!isCollapsed && <span>Policy issues</span>}
              </button>
            </div>
            <div
              className={`collapse_btn  ${
                isCollapsed ? "justify-content-start" : "justify-content-end"
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
              )}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              height: "80vh",
              overflowY: "auto",
            }}
            className=" bg-white shadow-sm rounded py-2 px-3 overflow-auto pb-4 scrollAble"
          >
            <div className="d-flex gap-3 border-bottom pb-3 ">
              <button className="btn monetization_btn fs-14 mt-3">Main</button>
              <button className="btn  fs-14 mt-3">Settings</button>
            </div>
            <div className="mt-4">
              <h4 className="fw-bold mb-0">Tools</h4>
              <div
                style={{ width: "38%" }}
                className="shadow py-3 px-3 mt-3 rounded"
              >
                <div className="d-flex align-items-center gap-3 ">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="1.4em"
                    height="1.4em"
                    class="xngnso2"
                  >
                    <g clip-path="url(#a)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm.839-17a.875.875 0 0 0-1.75 0v.991c-.715.075-1.364.276-1.884.645-.721.512-1.104 1.284-1.104 2.192 0 .84.34 1.54.968 2.033.587.461 1.364.695 2.192.8l1.352.172c.45.05.987.128 1.346.431.17.143.291.352.291.765 0 .27-.115.528-.418.746-.323.233-.887.432-1.747.432h-.177c-1.14 0-1.85-.258-2.468-.78a.875.875 0 0 0-1.13 1.336c.804.68 1.7 1.04 2.783 1.153a.918.918 0 0 0-.004.082V18a.875.875 0 1 0 1.75 0v-1.002a.869.869 0 0 0-.004-.083c.79-.09 1.479-.33 2.019-.72.725-.521 1.146-1.29 1.146-2.166 0-.83-.279-1.568-.912-2.102-.59-.499-1.39-.735-2.27-.832l-1.336-.17c-.677-.086-1.098-.256-1.332-.44-.194-.152-.3-.339-.3-.657 0-.372.133-.598.368-.764.275-.196.77-.357 1.551-.357h.154c.862 0 1.57.2 2.34.645a.875.875 0 0 0 .875-1.516c-.746-.43-1.488-.703-2.3-.817V6z"
                      ></path>
                    </g>
                    <defs>
                      <clipPath>
                        <path d="M0 0H24V24H0z"></path>
                      </clipPath>
                    </defs>
                  </svg>

                  <h5 className="fw-semibold mb-0">Content monetization</h5>
                </div>
                <div className="d-flex align-items-center gap-1 mt-2 ">
                  <span className="fs-14">
                    Approximate L28 day earnings for your Pages
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
                <p className="fs-2 mb-0 mt-5">${formatNumber(totalEarning)}</p>
                <div className="d-flex justify-content-end">
                  <Link to="/insights">
                    <button class="btn fs-14 insight_btn fw-semibold py-2 px-3 rounded  d-flex align-items-center gap-2">
                      View earnings
                    </button>
                  </Link>
                </div>
              </div>
              <div className="shadow pt-3 pb-5 px-3 mt-4 rounded">
                <div className="d-flex align-items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="1.5em"
                    height="1.5em"
                    class="xngnso2"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 1a8 8 0 0 0-6.216 13.037C7.324 15.935 9 18.018 9 20.463V22a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.537c0-2.445 1.676-4.528 3.216-6.426A8 8 0 0 0 12 1zM6 9a6 6 0 1 1 10.663 3.777l-.014.016c-.741.914-1.629 2.008-2.325 3.207h-.923l2.295-6.675a1 1 0 0 0-1.892-.65L12 13.924l-1.804-5.25a1 1 0 0 0-1.892.651L10.6 16h-.923c-.696-1.2-1.584-2.293-2.325-3.207l-.014-.016A5.967 5.967 0 0 1 6 9zm4.591 9A7.82 7.82 0 0 1 11 20.463V21h2v-.537c0-.88.157-1.702.409-2.463H10.59z"
                    ></path>
                  </svg>
                  <p className="fw-bold mb-0">How it works</p>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-4 mt-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="how_it_works">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="1.5em"
                        height="1.5em"
                        class="xngnso2"
                      >
                        <path d="M4.043 3H5v1a2 2 0 0 1-2 2H1.265c.046-.33.095-.636.144-.916C1.632 3.822 2.761 3 4.043 3zM10 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1 10c0-.715.024-1.383.064-2H3a4 4 0 0 0 4-4V3h6v1a4 4 0 0 0 4 4h1.936a30.795 30.795 0 0 1 0 4H17a4 4 0 0 0-4 4v1H7v-1a4 4 0 0 0-4-4H1.064A30.81 30.81 0 0 1 1 10zm9 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                        ></path>
                        <path d="M15 4V3h.957c1.282 0 2.41.822 2.634 2.084.05.28.098.585.144.916H17a2 2 0 0 1-2-2zM17 14h1.735c-.046.33-.095.636-.144.916C18.368 16.178 17.239 17 15.957 17H15v-1a2 2 0 0 1 2-2zM5 16v1h-.957c-1.282 0-2.41-.822-2.634-2.084-.05-.28-.098-.585-.144-.916H3a2 2 0 0 1 2 2z"></path>
                        <path d="M23 10a1 1 0 1 0-2 0v3c0 1.295-.081 2.43-.193 3.379-.18 1.525-1.544 2.621-3.28 2.621H5a1 1 0 1 0 0 2h12.527c2.543 0 4.945-1.662 5.267-4.387.12-1.021.206-2.234.206-3.613v-3z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="fw-bold mb-0">Create Original Content</p>
                      <span className="fs-14" style={{ lineHeight: "2px" }}>
                        Earn money for qualified views on video, plays on reels
                        and views, comments, shares and reactions on all other
                        eligible posts
                      </span>
                    </div>
                  </div>

                  <button
                    style={{ width: "8rem" }}
                    class="btn mx-auto fs-14 insight_btn fw-semibold py-2 px-3 rounded  d-flex align-items-center gap-2"
                  >
                    Create reels
                  </button>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-4 mt-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="how_it_works">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="1.5em"
                        height="1.5em"
                        class="xngnso2"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M21 17a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2v-7a2 2 0 0 1-2-2V6.463a2 2 0 0 1 1.394-1.906L11.09 1.79a3 3 0 0 1 1.82 0l8.696 2.767A2 2 0 0 1 23 6.463V8a2 2 0 0 1-2 2v7zm-2-7h-3v7h3v-7zM5 17h3v-7H5v7zm5 0h4v-7h-4v7z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="fw-bold mb-0">Create Original Content</p>
                      <span className="fs-14">
                        Final payments are calculated at the end of each month
                        and paid out about 21 days later. You must earn at least
                        $25 to get paid.
                      </span>
                    </div>
                  </div>

                  <button
                    style={{ width: "9rem" }}
                    class="btn fs-14 mx-auto insight_btn fw-semibold py-2 px-3 rounded  d-flex align-items-center gap-2"
                  >
                    View Payouts
                  </button>
                </div>
              </div>
              <div className="shadow pt-3 pb-5 px-3 mt-4 rounded">
                <p className="fw-bold mb-0">Tips and resources</p>
                <div className="d-flex align-items-center justify-content-between gap-4 mt-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="how_it_works learn">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="1.5em"
                        height="1.5em"
                        class="xngnso2"
                      >
                        <g clip-path="url(#a)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a1 1 0 1 0 0-2H6a1 1 0 1 1 0-2h14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6zm3 5a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9zm-1 5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"
                          ></path>
                        </g>
                        <defs>
                          <clipPath>
                            <path d="M0 0H24V24H0z"></path>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <p className="fw-bold mb-0">Learn more</p>
                      <span className="fs-14" style={{ lineHeight: "2px" }}>
                        About the content monetization program
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monetization;
