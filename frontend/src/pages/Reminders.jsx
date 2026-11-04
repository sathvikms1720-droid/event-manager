import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const styles = `
* {
  box-sizing: border-box;
}

.rm-wrap {
  min-height: 100vh;
  background: #f7f1e8;
  display: flex;
  justify-content: center;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  color: #3a2f26;
}

.rm-phone {
  width: 100%;
  max-width: 420px;
  background: #faf5ee;
  min-height: 100vh;
  padding: 16px 14px 40px;
}

.rm-tabs {
  display: flex;
  background: #f2e8dc;
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 14px;
}

.rm-tab {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px;
  border-radius: 11px;
  font-size: 13.5px;
  font-weight: 700;
  color: #9a8874;
  cursor: pointer;
  font-family: inherit;
}

.rm-tab.on {
  background: #fffdfa;
  color: #bd7a2c;
  box-shadow: 0 1px 3px rgba(146, 110, 66, .12);
}

.rm-search-row {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.rm-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fffdfa;
  border: 1px solid #f0e4d4;
  border-radius: 14px;
  padding: 0 12px;
}

.rm-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 0;
  font-size: 13.5px;
  font-family: inherit;
  color: #3a2f26;
}

.rm-search input::placeholder {
  color: #b0a191;
}

.rm-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fffdfa;
  border: 1px solid #f0e4d4;
  border-radius: 14px;
  padding: 0 14px;
  color: #b5793a;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.rm-filter.on {
  background: #f7ecdc;
}

.rm-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: -8px 0 16px;
}

.rm-chip {
  border: 1px solid #ecdfcd;
  background: #fdf7ef;
  color: #8a6a45;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.rm-chip.on {
  background: #bd7a2c;
  border-color: #bd7a2c;
  color: #fff;
}

.rm-sec {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.rm-sec h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.rm-sec span {
  font-size: 12px;
  color: #bd7a2c;
  font-weight: 600;
}

.rm-card {
  display: flex;
  gap: 10px;
  background: #fffdfa;
  border: 1px solid #f0e4d4;
  border-radius: 18px;
  padding: 10px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(146, 110, 66, .06);
}

.rm-thumb {
  width: 64px;
  height: 78px;
  border-radius: 12px;
  object-fit: cover;
  flex: none;
  background: #f2e6d6;
}

.rm-date {
  width: 48px;
  flex: none;
  background: #f7efe3;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 0;
}

.rm-date b {
  font-size: 17px;
  line-height: 1;
}

.rm-date i {
  font-style: normal;
  font-size: 10px;
  color: #a08a70;
  text-transform: uppercase;
  letter-spacing: .5px;
}

.rm-date u {
  text-decoration: none;
  font-size: 10px;
  color: #a08a70;
  margin-top: 2px;
}

.rm-body {
  flex: 1;
  min-width: 0;
}

.rm-body h3 {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 700;
}

.rm-body p {
  margin: 0 0 6px;
  font-size: 12px;
  color: #9a8874;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rm-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: #9a8874;
  margin-top: 3px;
}

.rm-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: none;
  padding: 2px 0;
}

.rm-bell {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: #fdf1e0;
  color: #c98a34;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.rm-bell.off {
  background: #f3efe9;
  color: #b8ada0;
}

.rm-dots {
  border: none;
  background: none;
  color: #b0a191;
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
  padding: 2px 6px;
}

.rm-done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: #4a8f52;
  font-size: 10px;
  font-weight: 600;
}

.rm-done .ring {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.6px solid #4a8f52;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rm-add {
  width: 100%;
  background: #fffdfa;
  border: 1.5px dashed #d8a15f;
  color: #bd7a2c;
  border-radius: 14px;
  padding: 13px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 22px;
}

.rm-empty {
  background: #fffdfa;
  border: 1px solid #f0e4d4;
  border-radius: 16px;
  padding: 22px;
  text-align: center;
  color: #9a8874;
  font-size: 13px;
  margin-bottom: 16px;
}

.rm-viewall {
  width: 100%;
  background: none;
  border: none;
  color: #bd7a2c;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  padding: 10px;
  font-family: inherit;
}

/* =========================
   REMINDER SHEET
========================= */

.rm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(50, 36, 22, .46);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
  animation: rmFade .18s ease;
}

@keyframes rmFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.rm-reminder-sheet {
  width: 100%;
  max-width: 420px;
  max-height: 92vh;
  overflow-y: auto;
scrollbar-width: none;
  background: #fffdfa;
  border-radius: 26px 26px 0 0;
  padding: 10px 16px 22px;
  animation: rmSlide .22s ease;
}
  .rm-reminder-sheet::-webkit-scrollbar {
  display: none;
}

@keyframes rmSlide {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.rm-handle {
  width: 70px;
  height: 5px;
  border-radius: 999px;
  background: #d9cfc2;
  margin: 2px auto 16px;
}

.rm-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.rm-sheet-head h2 {
  margin: 0;
  font-size: 23px;
  font-weight: 800;
  color: #211b16;
}

.rm-close {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: #f4eee7;
  color: #3a2f26;
  font-size: 25px;
  line-height: 1;
  cursor: pointer;
}

.rm-event-preview {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.rm-event-preview img {
  width: 76px;
  height: 76px;
  border-radius: 15px;
  object-fit: cover;
}

.rm-event-info {
  min-width: 0;
}

.rm-event-info h3 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 800;
  color: #211b16;
}

.rm-event-info p {
  margin: 2px 0;
  color: #9a8874;
  font-size: 13px;
}

.rm-event-info .venue {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  color: #8b6a47;
}

/* reminder on */

.rm-section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 9px;
  font-size: 14px;
  font-weight: 800;
  color: #32261d;
}

.rm-section-title span {
  color: #bd7a2c;
  font-size: 17px;
}

.rm-date-time-row {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.rm-date-time-box {
  flex: 1;
  min-width: 0;
  border: 1px solid #ecdfd1;
  border-radius: 15px;
  background: #fffdfa;
  padding: 11px 12px;
  cursor: pointer;
  transition: .15s ease;
}

.rm-date-time-box:hover {
  border-color: #d8a15f;
  background: #fffaf3;
}

.rm-box-label {
  font-size: 11px;
  color: #9a8874;
  margin-bottom: 4px;
}

.rm-box-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #3a2f26;
}

.rm-box-value svg {
  color: #bd7a2c;
  flex: none;
}

/* quick options */

.rm-quick-title {
  border-top: 1px solid #eee3d7;
  padding-top: 17px;
  margin-bottom: 11px;
}

.rm-quick-title span {
  color: #c37b1f;
}

.rm-quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.rm-quick {
  min-height: 45px;
  border: 1px solid #ecdfd1;
  background: #fffdfa;
  border-radius: 13px;
  color: #40352d;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.rm-quick.selected {
  background: #fff0df;
  border-color: #e6a35c;
  color: #a85e12;
  box-shadow: inset 0 0 0 1px #f1bd80;
}

.rm-quick.full {
  grid-column: 1 / -1;
}

.rm-custom-title {
  border-top: 1px solid #eee3d7;
  padding-top: 17px;
  margin-top: 17px;
}

.rm-custom-title span {
  color: #bd7a2c;
}

.rm-set-button {
  width: 100%;
  border: none;
  background: #c8751f;
  color: white;
  border-radius: 15px;
  padding: 15px;
  margin-top: 20px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 7px 18px rgba(190, 111, 26, .20);
}

.rm-set-button:active {
  transform: scale(.985);
}
  .rm-minute-slider {
  position: relative;
  width: 100%;
  user-select: none;
  touch-action: none;
  padding: 4px 0 0;
  cursor: grab;
}

.rm-minute-slider.dragging {
  cursor: grabbing;
}

.rm-minute-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2px;
  position: relative;
  z-index: 3;
  padding: 0 2px 32px;
}

.rm-minute-values button {
  border: none;
  background: transparent;
  min-width: 34px;
  height: 38px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  color: #4b4037;
  font-family: inherit;
  transition:
    background .15s ease,
    color .15s ease,
    transform .12s ease;
}

.rm-minute-values button.on {
  background: #c8751f;
  color: #fff;
  font-weight: 800;
  transform: scale(1.04);
}

/* =========================
   DATE / TIME PICKER
========================= */

.rm-picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(50, 36, 22, .50);
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.rm-picker {
  width: 100%;
  max-width: 420px;
  background: #fffdfa;
  border-radius: 26px;
  padding: 18px 18px 16px;
  box-shadow: 0 20px 60px rgba(55, 40, 25, .25);
  animation: rmPicker .18s ease;
}

@keyframes rmPicker {
  from {
    opacity: 0;
    transform: scale(.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.rm-picker-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 17px;
}

.rm-picker-head h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #211b16;
}

.rm-picker-close {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: #f4eee7;
  cursor: pointer;
  font-size: 21px;
}

.rm-month-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.rm-month-row strong {
  font-size: 16px;
}

.rm-month-arrow {
  width: 35px;
  height: 35px;
  border: none;
  background: transparent;
  border-radius: 50%;
  font-size: 23px;
  cursor: pointer;
  color: #4b3829;
}

.rm-weekdays,
.rm-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.rm-weekday {
  text-align: center;
  font-size: 10px;
  color: #8f7d6b;
  padding-bottom: 5px;
}

.rm-day {
  height: 40px;
  border: none;
  border-radius: 11px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #3a2f26;
}

.rm-day.muted {
  color: #c8bcae;
}

.rm-day:hover {
  background: #f8eadb;
}

.rm-day.selected {
  background: #c8751f;
  color: #fff;
  font-weight: 800;
}

.rm-picker-actions {
  display: flex;
  gap: 10px;
  margin-top: 17px;
}

.rm-picker-cancel,
.rm-picker-select {
  flex: 1;
  border: none;
  border-radius: 13px;
  padding: 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.rm-picker-cancel {
  background: #f5ede4;
  color: #765d45;
}

.rm-picker-select {
  background: #c8751f;
  color: #fff;
}

/* time picker */

/* =========================
   MODERN TIME PICKER
========================= */

.rm-time-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 8px 0 20px;
}

.rm-time-number {
  width: 82px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 14px;

  background: #fff0df;
  color: #2d2118;

  font-size: 30px;
  font-weight: 800;
  font-family: inherit;
}

/* =========================
   TOP SCROLL TIME NUMBERS
========================= */

.rm-top-time-wheel {
  width: 82px;
  height: 70px;

  overflow-y: auto;
  overflow-x: hidden;

  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;

  scrollbar-width: none;

  border-radius: 14px;
  background: #fff0df;

  -webkit-overflow-scrolling: touch;
}

.rm-top-time-wheel::-webkit-scrollbar {
  display: none;
}

.rm-top-wheel-list {
  padding: 14px 0;
}

.rm-top-wheel-number {
  width: 100%;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  background: transparent;

  scroll-snap-align: center;

  font-family: inherit;
  font-size: 20px;
  font-weight: 600;

  color: #b19c88;

  cursor: pointer;

  transition:
    color .15s ease,
    transform .15s ease;
}

.rm-top-wheel-number.selected {
  color: #2d2118;
  font-size: 30px;
  font-weight: 800;
}

.rm-top-wheel-number:hover {
  color: #c8751f;
}
.rm-time-colon {
  font-size: 27px;
  font-weight: 800;
  color: #2d2118;
}

.rm-period {
  display: flex;
  align-items: center;

  margin-left: 4px;
  padding: 4px;

  background: #f5eadf;
  border-radius: 12px;
}

.rm-period button {
  min-width: 42px;
  height: 40px;

  border: none;
  border-radius: 9px;

  background: transparent;
  color: #4b4037;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
  font-family: inherit;

  transition: all .18s ease;
}

.rm-period button.on {
  background: #c8751f;
  color: #fff;

  box-shadow: 0 2px 5px rgba(150, 80, 15, .18);
}


/* =========================
   CLOCK
========================= */

.rm-clock {
  width: 250px;
  height: 250px;

  position: relative;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: #fbf3ea;

  touch-action: none;
  user-select: none;

  cursor: grab;

  transition: transform .12s ease;
}

.rm-clock.dragging {
  cursor: grabbing;
  transform: scale(1.015);
}


/* CLOCK NUMBERS */

.rm-clock-number {
  position: absolute;

  transform: translate(-50%, -50%);

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;

  background: transparent;

  color: #493d33;

  font-size: 14px;
  font-weight: 500;

  cursor: pointer;
  font-family: inherit;

  transition:
    background .16s ease,
    color .16s ease,
    transform .16s ease;
}

.rm-clock-number:hover {
  background: #f2e3d3;
}

.rm-clock-number.selected {
  width: 42px;
  height: 42px;

  background: #c8751f;
  color: #fff;

  font-size: 15px;
  font-weight: 800;

  box-shadow: 0 3px 8px rgba(190, 111, 26, .22);
}


/* CLOCK HAND */

.rm-clock-hand {
  position: absolute;

  width: 2px;
  height: 82px;

  left: 50%;
  top: 50%;

  background: #c8751f;

  transform-origin: bottom center;

  border-radius: 4px;

  pointer-events: none;

  z-index: 1;
}

.rm-clock-center {
  position: absolute;

  width: 11px;
  height: 11px;

  left: calc(50% - 5.5px);
  top: calc(50% - 5.5px);

  background: #c8751f;

  border-radius: 50%;

  z-index: 3;

  pointer-events: none;
}


/* =========================
   MINUTES
========================= */

.rm-minute-title {
  margin: 0 0 9px;

  font-size: 13px;
  font-weight: 800;

  color: #40352d;
}

.rm-minute-slider {
  position: relative;

  width: 100%;

  padding: 3px 0 0;

  user-select: none;
  touch-action: none;

  cursor: grab;
}

.rm-minute-slider.dragging {
  cursor: grabbing;
}

.rm-minute-values {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 2px;

  position: relative;
  z-index: 3;

  padding: 0 2px 32px;
}

.rm-minute-values button {
  min-width: 30px;
  height: 36px;

  border: none;
  border-radius: 9px;

  background: transparent;

  color: #5a4c40;

  font-size: 11px;
  font-weight: 500;

  cursor: pointer;
  font-family: inherit;

  transition:
    background .15s ease,
    color .15s ease,
    transform .12s ease;
}

.rm-minute-values button.on {
  background: #c8751f;
  color: #fff;

  font-weight: 800;

  transform: scale(1.05);

  box-shadow: 0 2px 6px rgba(190, 111, 26, .18);
}


/* MINUTE TRACK */

.rm-minute-track {
  position: absolute;

  left: 5px;
  right: 5px;

  top: 39px;

  height: 7px;

  border-radius: 999px;

  background: #e5ddd4;

  pointer-events: none;
}

.rm-minute-fill {
  position: absolute;

  left: 0;
  top: 0;

  height: 100%;

  border-radius: 999px;

  background: #d17a1e;

  transition: width .08s linear;
}

.rm-minute-thumb {
  position: absolute;

  top: 50%;

  width: 24px;
  height: 24px;

  border-radius: 50%;

  background: #c8751f;

  border: 4px solid #fffdfa;

  box-shadow: 0 2px 7px rgba(120, 70, 20, .25);

  transform: translate(-50%, -50%);

  transition: left .08s linear;
}
/* notification info */

.rm-notification-info {
  display: flex;
  gap: 10px;
  align-items: center;
  background: #fff0df;
  border-radius: 15px;
  padding: 12px;
  margin-top: 18px;
}

.rm-notification-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: #fff8ef;
  color: #bd6e18;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.rm-notification-info strong {
  display: block;
  font-size: 12.5px;
  margin-bottom: 2px;
}

.rm-notification-info p {
  margin: 0;
  font-size: 10.5px;
  color: #8f765f;
  line-height: 1.35;
}

@media (max-width: 360px) {
  .rm-phone {
    padding-left: 10px;
    padding-right: 10px;
  }

  .rm-reminder-sheet {
    padding-left: 12px;
    padding-right: 12px;
  }

  .rm-event-preview img {
    width: 66px;
    height: 66px;
  }

  .rm-quick {
    font-size: 11px;
  }
}
`;

const PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1470229722913-7ea0d1e1d1e1?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=70",
];

const Svg = ({
  children,
  size = 16,
  color = "currentColor",
  w = 1.8,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const IcSearch = () => (
  <Svg color="#b0a191">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

const IcFilter = () => (
  <Svg>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Svg>
);

const IcBell = () => (
  <Svg size={15}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </Svg>
);

const IcClock = () => (
  <Svg size={13} color="#b0a191">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

const IcPin = () => (
  <Svg size={13} color="#b0a191">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

const IcCheck = () => (
  <Svg size={14} color="#4a8f52" w={2.4}>
    <polyline points="20 6 9 17 4 12" />
  </Svg>
);

const IcCalendar = ({ size = 17 }) => (
  <Svg size={size} color="#bd7a2c">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

const getEventPhoto = (eventType = "") => {
  const type = String(eventType).toLowerCase();

  if (type.includes("wedding")) return PHOTOS[0];
  if (type.includes("birthday")) return PHOTOS[3];
  if (type.includes("conference") || type.includes("corporate")) {
    return PHOTOS[4];
  }
  if (type.includes("dinner")) return PHOTOS[5];
  if (type.includes("concert") || type.includes("music")) return PHOTOS[6];
  if (type.includes("sports")) return PHOTOS[7];

  return PHOTOS[2];
};

const API = "https://event-manager-pls6.onrender.com";

const MON = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parts = (iso) => {
  const d = new Date(`${iso}T00:00:00`);

  if (Number.isNaN(d.getTime())) {
    return { m: "—", d: "--", w: "" };
  }

  return {
    m: MON[d.getMonth()],
    d: String(d.getDate()).padStart(2, "0"),
    w: DAY[d.getDay()],
  };
};

const hhmm = (t) => {
  if (!t) return "";

  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;

  return `${String(hr).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )} ${ap}`;
};

const TYPES = ["All", "Wedding", "Birthday", "Meeting", "Other"];

const mapEvent = (event, alertState = {}) => {
  const date = event.event_date || "";
  const time = event.event_time
    ? String(event.event_time).slice(0, 5)
    : "";

  return {
    id: event.id,
    title: event.event_name || "Untitled Event",
    sub: event.client_name || "No client",
    date,
    start: time,
    end: "",
    place: event.venue || "No venue",
    photo: getEventPhoto(event.event_type),
    alert: alertState[event.id] !== false,
    done:
      String(event.status || "").toLowerCase() === "completed" ||
      (date && date < new Date().toISOString().slice(0, 10)),
    type: String(event.event_type || "Other")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    notes: event.notes || "",
    guests: Number(event.guests ?? 0),
    raw: event,
  };
};

/* =========================
   DATE HELPERS
========================= */

const pad = (value) => String(value).padStart(2, "0");

const formatDateLong = (date) => {
  if (!date) return "";

  const d = new Date(`${date}T00:00:00`);

  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime12 = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const ap = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;

  return `${pad(h)}:${pad(minutes)} ${ap}`;
};

const addMinutes = (dateString, timeString, minutes) => {
  const date = new Date(`${dateString}T${timeString}:00`);

  if (Number.isNaN(date.getTime())) {
    return {
      date: dateString,
      time: timeString,
    };
  }

  date.setMinutes(date.getMinutes() + minutes);

  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
};

const getDaysForMonth = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const start = firstDay.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();

  const result = [];

  for (let i = start - 1; i >= 0; i--) {
    result.push({
      day: daysInPreviousMonth - i,
      current: false,
      date: new Date(year, month - 1, daysInPreviousMonth - i),
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    result.push({
      day,
      current: true,
      date: new Date(year, month, day),
    });
  }

  let nextDay = 1;

  while (result.length < 42) {
    result.push({
      day: nextDay,
      current: false,
      date: new Date(year, month + 1, nextDay),
    });

    nextDay++;
  }

  return result;
};

/* =========================
   REMINDER PAGE
========================= */

export default function Reminder() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [type, setType] = useState("All");
  const [menuId, setMenuId] = useState(null);
  const [toast, setToast] = useState("");
  const [showAllDone, setShowAllDone] = useState(false);
  const [loading, setLoading] = useState(true);

  /* Reminder UI */
  const [reminderEvent, setReminderEvent] = useState(null);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [selectedQuick, setSelectedQuick] = useState("event");

  const [picker, setPicker] = useState(null);

  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [timeHour, setTimeHour] = useState(12);
  const [timeMinute, setTimeMinute] = useState(0);
  const [timePeriod, setTimePeriod] = useState("PM");
  const clockRef = useRef(null);
const minuteSliderRef = useRef(null);

const [draggingClock, setDraggingClock] = useState(false);
const [draggingMinute, setDraggingMinute] = useState(false);
const hourWheelRef = useRef(null);
const minuteWheelRef = useRef(null);

const scrollHours = Array.from(
  { length: 12 },
  (_, i) => i + 1
);

const scrollMinutes = Array.from(
  { length: 60 },
  (_, i) => i
);  
const say = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 1800);
  };

  const loadEvents = async () => {
    try {
      setLoading(true);

      const savedAlerts = JSON.parse(
        localStorage.getItem("event_reminder_alerts") || "{}"
      );

      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API}/events/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load events");
      }

      const data = await response.json();

      setItems(
        (data || []).map((event) => mapEvent(event, savedAlerts))
      );
    } catch (error) {
      console.error("Failed to load reminder events:", error);
      setItems([]);
      say("Unable to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    return items
      .filter((e) => (type === "All" ? true : e.type === type))
      .filter(
        (e) =>
          !term ||
          `${e.title} ${e.sub} ${e.place} ${e.type}`
            .toLowerCase()
            .includes(term)
      )
      .sort((a, b) =>
        `${a.date} ${a.start}`.localeCompare(
          `${b.date} ${b.start}`
        )
      );
  }, [items, q, type]);

  const upcoming = filtered.filter((e) => !e.done);
  const completed = filtered.filter((e) => e.done);

  const list = tab === "upcoming" ? upcoming : completed;

  const shown =
    tab === "upcoming" || showAllDone
      ? list
      : list.slice(0, 2);

  const toggleAlert = (id) => {
    setItems((current) => {
      const updated = current.map((event) =>
        event.id === id
          ? { ...event, alert: !event.alert }
          : event
      );

      const alertState = {};

      updated.forEach((event) => {
        alertState[event.id] = event.alert;
      });

      localStorage.setItem(
        "event_reminder_alerts",
        JSON.stringify(alertState)
      );

      return updated;
    });

    const current = items.find((event) => event.id === id);

    say(current?.alert ? "Reminder off" : "Reminder on");
  };

  const deleteEvent = async (event) => {
    if (!event?.id) return;

    const confirmed = window.confirm(
      `Delete "${event.title}"? This will remove the event from your database.`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API}/events/${event.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setItems((current) =>
        current.filter((item) => item.id !== event.id)
      );

      setMenuId(null);

      say("Event deleted");
    } catch (error) {
      console.error(error);
      say("Failed to delete event");
    }
  };

  /* =========================
     OPEN REMINDER
  ========================= */

  const openReminder = (event) => {
    const saved = JSON.parse(
      localStorage.getItem("event_reminders") || "{}"
    );

    const existing = saved[event.id];

    const date = existing?.date || event.date;
    const time = existing?.time || event.start || "12:00";

    setReminderEvent(event);
    setReminderDate(date);
    setReminderTime(time);
    setSelectedQuick(existing?.quick || "event");

    const [h, m] = time.split(":").map(Number);

    let hour = h % 12 || 12;
    let period = h >= 12 ? "PM" : "AM";

    setTimeHour(hour);
    setTimeMinute(m);
    setTimePeriod(period);

    const selectedDate = new Date(`${date}T00:00:00`);

    if (!Number.isNaN(selectedDate.getTime())) {
      setCalendarMonth(selectedDate);
    }
  };

  const closeReminder = () => {
    setReminderEvent(null);
    setPicker(null);
  };

  /* =========================
     QUICK REMINDERS
  ========================= */

  const applyQuick = (option) => {
    if (!reminderEvent) return;

    const eventDate = reminderEvent.date;
    const eventTime = reminderEvent.start || "12:00";

    let result = {
      date: eventDate,
      time: eventTime,
    };

    if (option === "10") {
      result = addMinutes(eventDate, eventTime, -10);
    }

    if (option === "30") {
      result = addMinutes(eventDate, eventTime, -30);
    }

    if (option === "60") {
      result = addMinutes(eventDate, eventTime, -60);
    }

    if (option === "day") {
      result = addMinutes(eventDate, eventTime, -1440);
    }

    setReminderDate(result.date);
    setReminderTime(result.time);
    setSelectedQuick(option);
    updateClockFromTime(result.time);
  };
const handleHourWheelScroll = (event) => {
  const itemHeight = 42;

  const index = Math.round(
    event.currentTarget.scrollTop / itemHeight
  );

  const hour = Math.min(
    12,
    Math.max(1, index + 1)
  );

  if (hour !== timeHour) {
    setTimeHour(hour);
  }
};

const handleMinuteWheelScroll = (event) => {
  const itemHeight = 42;

  const minute = Math.min(
    59,
    Math.max(
      0,
      Math.round(
        event.currentTarget.scrollTop / itemHeight
      )
    )
  );

  if (minute !== timeMinute) {
    setTimeMinute(minute);
  }
};

const selectHourFromWheel = (hour) => {
  setTimeHour(hour);

  if (hourWheelRef.current) {
    hourWheelRef.current.scrollTo({
      top: (hour - 1) * 42,
      behavior: "smooth",
    });
  }
};

const selectMinuteFromWheel = (minute) => {
  setTimeMinute(minute);

  if (minuteWheelRef.current) {
    minuteWheelRef.current.scrollTo({
      top: minute * 42,
      behavior: "smooth",
    });
  }
};
  /* =========================
     TIME
  ========================= */

  const updateClockFromTime = (time) => {
    if (!time) return;

    const [h, m] = time.split(":").map(Number);

    setTimeHour(h % 12 || 12);
    setTimeMinute(m);
    setTimePeriod(h >= 12 ? "PM" : "AM");
  };
  /* =========================
   SMOOTH CLOCK DRAG
========================= */

const updateHourFromPointer = (event) => {
  if (!clockRef.current) return;

  const rect = clockRef.current.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const x = event.clientX - centerX;
  const y = event.clientY - centerY;

  let angle =
    Math.atan2(y, x) * (180 / Math.PI) + 90;

  if (angle < 0) {
    angle += 360;
  }

  let hour = Math.round(angle / 30);

  if (hour === 0 || hour === 12) {
    hour = 12;
  }

  if (hour > 12) {
    hour -= 12;
  }

  setTimeHour(hour);
};

const handleClockPointerDown = (event) => {
  event.preventDefault();

  setDraggingClock(true);

  event.currentTarget.setPointerCapture(
    event.pointerId
  );

  updateHourFromPointer(event);
};

const handleClockPointerMove = (event) => {
  if (!draggingClock) return;

  event.preventDefault();

  updateHourFromPointer(event);
};

const handleClockPointerUp = (event) => {
  setDraggingClock(false);

  try {
    event.currentTarget.releasePointerCapture(
      event.pointerId
    );
  } catch {
    // Ignore pointer release errors
  }
};


/* =========================
   SMOOTH MINUTE DRAG
========================= */

const updateMinuteFromPointer = (event) => {
  if (!minuteSliderRef.current) return;

  const rect =
    minuteSliderRef.current.getBoundingClientRect();

  let percentage =
    (event.clientX - rect.left) / rect.width;

  percentage = Math.max(
    0,
    Math.min(1, percentage)
  );

  const rawMinute = percentage * 55;

  // Snap to 5-minute intervals
  let minute =
    Math.round(rawMinute / 5) * 5;

  if (minute > 55) {
    minute = 55;
  }

  setTimeMinute(minute);
};

const handleMinutePointerDown = (event) => {
  event.preventDefault();

  setDraggingMinute(true);

  event.currentTarget.setPointerCapture(
    event.pointerId
  );

  updateMinuteFromPointer(event);
};

const handleMinutePointerMove = (event) => {
  if (!draggingMinute) return;

  event.preventDefault();

  updateMinuteFromPointer(event);
};

const handleMinutePointerUp = (event) => {
  setDraggingMinute(false);

  try {
    event.currentTarget.releasePointerCapture(
      event.pointerId
    );
  } catch {
    // Ignore pointer release errors
  }
};

  const applyTime = () => {
    let hour = Number(timeHour);

    if (timePeriod === "AM" && hour === 12) {
      hour = 0;
    }

    if (timePeriod === "PM" && hour !== 12) {
      hour += 12;
    }

    const time = `${pad(hour)}:${pad(timeMinute)}`;

    setReminderTime(time);
    setSelectedQuick("custom");
    setPicker(null);
  };

  /* =========================
     DATE
  ========================= */

  const selectCalendarDate = (date) => {
    const value = `${date.getFullYear()}-${pad(
      date.getMonth() + 1
    )}-${pad(date.getDate())}`;

    setReminderDate(value);
    setSelectedQuick("custom");
  };

  const openDatePicker = () => {
    const selected = reminderDate
      ? new Date(`${reminderDate}T00:00:00`)
      : new Date();

    setCalendarMonth(selected);
    setPicker("date");
  };

  const openTimePicker = () => {
  const time = reminderTime || "12:00";

  updateClockFromTime(time);

  const [h, m] = time.split(":").map(Number);

  const hour = h % 12 || 12;

  setPicker("time");

  setTimeout(() => {

    if (hourWheelRef.current) {
      hourWheelRef.current.scrollTop =
        (hour - 1) * 42;
    }

    if (minuteWheelRef.current) {
      minuteWheelRef.current.scrollTop =
        m * 42;
    }

  }, 50);
};

  /* =========================
     SAVE REMINDER FRONTEND
  ========================= */

  const saveReminder = () => {
    if (!reminderEvent || !reminderDate || !reminderTime) {
      say("Please select date and time");
      return;
    }

    const reminders = JSON.parse(
      localStorage.getItem("event_reminders") || "{}"
    );

    reminders[reminderEvent.id] = {
      eventId: reminderEvent.id,
      date: reminderDate,
      time: reminderTime,
      quick: selectedQuick,
      eventName: reminderEvent.title,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "event_reminders",
      JSON.stringify(reminders)
    );

    setItems((current) =>
      current.map((event) =>
        event.id === reminderEvent.id
          ? { ...event, alert: true }
          : event
      )
    );

    closeReminder();

    say(
      `Reminder set for ${formatDateLong(
        reminderDate
      )} at ${formatTime12(reminderTime)}`
    );
  };

  const active = items.find((e) => e.id === menuId);

  return (
    <div className="rm-wrap">
      <style>{styles}</style>

      <div className="rm-phone">

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            border: "none",
            background: "transparent",
            color: "#bd7a2c",
            fontSize: "13px",
            fontWeight: "700",
            padding: "4px 0 12px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Dashboard
        </button>

        {/* Tabs */}
        <div className="rm-tabs">
          <button
            className={`rm-tab${
              tab === "upcoming" ? " on" : ""
            }`}
            onClick={() => setTab("upcoming")}
          >
            Upcoming
          </button>

          <button
            className={`rm-tab${
              tab === "completed" ? " on" : ""
            }`}
            onClick={() => setTab("completed")}
          >
            Completed
          </button>
        </div>

        {/* Search */}
        <div className="rm-search-row">
          <label className="rm-search">
            <IcSearch />

            <input
              placeholder="Search events..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <button
            className={`rm-filter${
              showFilters ? " on" : ""
            }`}
            onClick={() =>
              setShowFilters((v) => !v)
            }
          >
            <IcFilter />
            Filter
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="rm-filters">
            {TYPES.map((t) => (
              <button
                key={t}
                className={`rm-chip${
                  type === t ? " on" : ""
                }`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Section */}
        <div className="rm-sec">
          <h2>
            {tab === "upcoming"
              ? "Upcoming Events"
              : "Completed Events"}
          </h2>

          <span>{list.length} Events</span>
        </div>

        {/* Events */}
        {loading ? (
          <div className="rm-empty">
            Loading your real events...
          </div>
        ) : shown.length === 0 ? (
          <div className="rm-empty">
            No {tab} events found.
          </div>
        ) : (
          shown.map((e) => {
            const p = parts(e.date);

            return (
              <div className="rm-card" key={e.id}>

                <img
                  className="rm-thumb"
                  src={e.photo}
                  alt={`${e.title} cover`}
                  loading="lazy"
                />

                <div className="rm-date">
                  <i>{p.m}</i>
                  <b>{p.d}</b>
                  <u>{p.w}</u>
                </div>

                <div className="rm-body">
                  <h3>{e.title}</h3>

                  <p>{e.sub}</p>

                  <div className="rm-meta">
                    <IcClock />
                    {hhmm(e.start)}
                    {e.end
                      ? ` – ${hhmm(e.end)}`
                      : ""}
                  </div>

                  <div className="rm-meta">
                    <IcPin />
                    {e.place}
                  </div>

                  {e.guests > 0 && (
                    <div className="rm-meta">
                      👥 {e.guests} guests
                    </div>
                  )}
                </div>

                <div className="rm-side">

                  {e.done ? (
                    <div className="rm-done">
                      <span className="ring">
                        <IcCheck />
                      </span>
                      Completed
                    </div>
                  ) : (
                    <button
                      className={`rm-bell${
                        e.alert ? "" : " off"
                      }`}
                      aria-label="Set reminder"
                      onClick={() => openReminder(e)}
                    >
                      <IcBell />
                    </button>
                  )}

                  <button
                    className="rm-dots"
                    aria-label="More options"
                    onClick={() => setMenuId(e.id)}
                  >
                    ⋮
                  </button>

                </div>
              </div>
            );
          })
        )}

        {/* Bottom action */}
        {tab === "upcoming" ? (
          <button
            className="rm-add"
            onClick={() => navigate("/add-event")}
          >
            + Add New Event
          </button>
        ) : (
          list.length > 2 && (
            <button
              className="rm-viewall"
              onClick={() =>
                setShowAllDone((v) => !v)
              }
            >
              {showAllDone
                ? "Show Less"
                : "View All Completed Events ›"}
            </button>
          )
        )}
      </div>

      {/* =========================
          SET REMINDER SHEET
      ========================= */}

      {reminderEvent && (
        <div
          className="rm-overlay"
          onClick={closeReminder}
        >
          <div
            className="rm-reminder-sheet"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="rm-handle" />

            <div className="rm-sheet-head">
              <h2>Set Reminder</h2>

              <button
                className="rm-close"
                onClick={closeReminder}
              >
                ×
              </button>
            </div>

            {/* Event information */}
            <div className="rm-event-preview">

              <img
                src={reminderEvent.photo}
                alt={reminderEvent.title}
              />

              <div className="rm-event-info">
                <h3>{reminderEvent.title}</h3>

                <p>{reminderEvent.sub}</p>

                <p className="venue">
                  <IcPin />
                  {reminderEvent.place}
                </p>
              </div>

            </div>

            {/* Reminder date/time */}
            <div className="rm-section-title">
              <span>▣</span>
              Remind me on
            </div>

            <div className="rm-date-time-row">

              <button
                className="rm-date-time-box"
                onClick={openDatePicker}
              >
                <div className="rm-box-label">
                  Date
                </div>

                <div className="rm-box-value">
                  <span>
                    {formatDateLong(reminderDate)}
                  </span>

                  <span>⌄</span>
                </div>
              </button>

              <button
                className="rm-date-time-box"
                onClick={openTimePicker}
              >
                <div className="rm-box-label">
                  Time
                </div>

                <div className="rm-box-value">
                  <span>
                    {formatTime12(reminderTime)}
                  </span>

                  <span>⌄</span>
                </div>
              </button>

            </div>

            {/* Quick options */}
            <div className="rm-section-title rm-quick-title">
              <span>ϟ</span>
              Quick options
            </div>

            <div className="rm-quick-grid">

              <button
                className={`rm-quick ${
                  selectedQuick === "event"
                    ? "selected"
                    : ""
                }`}
                onClick={() => applyQuick("event")}
              >
                🔔 At event time
              </button>

              <button
                className={`rm-quick ${
                  selectedQuick === "10"
                    ? "selected"
                    : ""
                }`}
                onClick={() => applyQuick("10")}
              >
                ◷ 10 minutes before
              </button>

              <button
                className={`rm-quick ${
                  selectedQuick === "30"
                    ? "selected"
                    : ""
                }`}
                onClick={() => applyQuick("30")}
              >
                ◷ 30 minutes before
              </button>

              <button
                className={`rm-quick ${
                  selectedQuick === "60"
                    ? "selected"
                    : ""
                }`}
                onClick={() => applyQuick("60")}
              >
                ◷ 1 hour before
              </button>

              <button
                className={`rm-quick full ${
                  selectedQuick === "day"
                    ? "selected"
                    : ""
                }`}
                onClick={() => applyQuick("day")}
              >
                ▣ 1 day before
              </button>

            </div>

            {/* Custom */}
            <div className="rm-section-title rm-custom-title">
              <span>✎</span>
              Custom reminder
              <small
                style={{
                  fontWeight: 500,
                  color: "#a28f7b",
                }}
              >
                (optional)
              </small>
            </div>

            <div className="rm-date-time-row">

              <button
                className="rm-date-time-box"
                onClick={openDatePicker}
              >
                <div className="rm-box-label">
                  Custom Date
                </div>

                <div className="rm-box-value">
                  <span>
                    {formatDateLong(reminderDate)}
                  </span>

                  <span>⌄</span>
                </div>
              </button>

              <button
                className="rm-date-time-box"
                onClick={openTimePicker}
              >
                <div className="rm-box-label">
                  Custom Time
                </div>

                <div className="rm-box-value">
                  <span>
                    {formatTime12(reminderTime)}
                  </span>

                  <span>⌄</span>
                </div>
              </button>

            </div>

            {/* Notification information */}
            <div className="rm-notification-info">

              <div className="rm-notification-icon">
                <IcBell size={20} />
              </div>

              <div>
                <strong>
                  Reminder will be saved
                </strong>

                <p>
                  Phone notification will be connected
                  in the next step.
                </p>
              </div>

            </div>

            {/* Save */}
            <button
              className="rm-set-button"
              onClick={saveReminder}
            >
              🔔 &nbsp; Set Reminder
            </button>

          </div>
        </div>
      )}

      {/* =========================
          DATE PICKER
      ========================= */}

      {picker === "date" && (
        <div className="rm-picker-overlay">
          <div className="rm-picker">

            <div className="rm-picker-head">
              <h3>Select Date</h3>

              <button
                className="rm-picker-close"
                onClick={() => setPicker(null)}
              >
                ×
              </button>
            </div>

            <div className="rm-month-row">

              <button
                className="rm-month-arrow"
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() - 1,
                      1
                    )
                  )
                }
              >
                ‹
              </button>

              <strong>
                {calendarMonth.toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}
              </strong>

              <button
                className="rm-month-arrow"
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() + 1,
                      1
                    )
                  )
                }
              >
                ›
              </button>

            </div>

            <div className="rm-weekdays">
              {[
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ].map((day) => (
                <div
                  key={day}
                  className="rm-weekday"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="rm-calendar">

              {getDaysForMonth(
                calendarMonth.getFullYear(),
                calendarMonth.getMonth()
              ).map((item, index) => {

                const value = `${item.date.getFullYear()}-${pad(
                  item.date.getMonth() + 1
                )}-${pad(item.date.getDate())}`;

                const selected =
                  value === reminderDate;

                return (
                  <button
                    key={`${value}-${index}`}
                    className={`rm-day ${
                      !item.current ? "muted" : ""
                    } ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() =>
                      selectCalendarDate(item.date)
                    }
                  >
                    {item.day}
                  </button>
                );
              })}

            </div>

            <div className="rm-picker-actions">

              <button
                className="rm-picker-cancel"
                onClick={() => setPicker(null)}
              >
                Cancel
              </button>

              <button
                className="rm-picker-select"
                onClick={() => setPicker(null)}
              >
                Select
              </button>

            </div>

          </div>
        </div>
      )}

     {/* =========================
    TIME PICKER
========================= */}

{picker === "time" && (
  <div className="rm-picker-overlay">

    <div className="rm-picker">

      {/* Header */}

      <div className="rm-picker-head">
        <h3>Select Time</h3>

        <button
          className="rm-picker-close"
          onClick={() => setPicker(null)}
        >
          ×
        </button>
      </div>


      {/* Selected Time */}

      <div className="rm-time-display">

  {/* HOUR SCROLL */}

  <div
    ref={hourWheelRef}
    className="rm-top-time-wheel"
    onScroll={handleHourWheelScroll}
  >

    <div className="rm-top-wheel-list">

      {scrollHours.map((hour) => (
        <button
          key={hour}
          type="button"
          className={
            timeHour === hour
              ? "rm-top-wheel-number selected"
              : "rm-top-wheel-number"
          }
          onClick={() =>
            selectHourFromWheel(hour)
          }
        >
          {pad(hour)}
        </button>
      ))}

    </div>

  </div>


  <div className="rm-time-colon">
    :
  </div>


  {/* MINUTE SCROLL */}

  <div
    ref={minuteWheelRef}
    className="rm-top-time-wheel"
    onScroll={handleMinuteWheelScroll}
  >

    <div className="rm-top-wheel-list">

      {scrollMinutes.map((minute) => (
        <button
          key={minute}
          type="button"
          className={
            timeMinute === minute
              ? "rm-top-wheel-number selected"
              : "rm-top-wheel-number"
          }
          onClick={() =>
            selectMinuteFromWheel(minute)
          }
        >
          {pad(minute)}
        </button>
      ))}

    </div>

  </div>


  {/* KEEP AM / PM EXACTLY AS IT IS */}

  <div className="rm-period">

    <button
      className={
        timePeriod === "AM"
          ? "on"
          : ""
      }
      onClick={() =>
        setTimePeriod("AM")
      }
    >
      AM
    </button>

    <button
      className={
        timePeriod === "PM"
          ? "on"
          : ""
      }
      onClick={() =>
        setTimePeriod("PM")
      }
    >
      PM
    </button>

  </div>

</div>


      {/* Clock */}

      <div
        ref={clockRef}
        className={`rm-clock${
          draggingClock
            ? " dragging"
            : ""
        }`}
        onPointerDown={
          handleClockPointerDown
        }
        onPointerMove={
          handleClockPointerMove
        }
        onPointerUp={
          handleClockPointerUp
        }
        onPointerCancel={
          handleClockPointerUp
        }
      >

        {Array.from(
          { length: 12 },
          (_, index) => {

            const number =
              index + 1;

            const angle =
              number * 30 - 90;

            const radius = 42;

            const x =
              50 +
              radius *
                Math.cos(
                  (angle * Math.PI) /
                    180
                );

            const y =
              50 +
              radius *
                Math.sin(
                  (angle * Math.PI) /
                    180
                );

            return (
              <button
                key={number}
                type="button"
                className={`rm-clock-number ${
                  timeHour === number
                    ? "selected"
                    : ""
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setTimeHour(number);
                }}
              >
                {number}
              </button>
            );
          }
        )}


        {/* Clock hand */}

        <div
          className="rm-clock-hand"
          style={{
            transform: `
              translate(-50%, -100%)
              rotate(${timeHour * 30}deg)
            `,
          }}
        />


        {/* Center */}

        <div className="rm-clock-center" />

      </div>


      {/* Minutes */}

      <div className="rm-minute-title">
        Minute
      </div>

      <div
        ref={minuteSliderRef}
        className={`rm-minute-slider${
          draggingMinute
            ? " dragging"
            : ""
        }`}
        onPointerDown={
          handleMinutePointerDown
        }
        onPointerMove={
          handleMinutePointerMove
        }
        onPointerUp={
          handleMinutePointerUp
        }
        onPointerCancel={
          handleMinutePointerUp
        }
      >

        <div className="rm-minute-values">

          {[
            0,
            5,
            10,
            15,
            20,
            25,
            30,
            35,
            40,
            45,
            50,
            55,
          ].map((minute) => (

            <button
              key={minute}
              type="button"
              className={
                timeMinute === minute
                  ? "on"
                  : ""
              }
              onPointerDown={(event) => {
                event.stopPropagation();
                setTimeMinute(minute);
              }}
            >
              {pad(minute)}
            </button>

          ))}

        </div>


        {/* Slider */}

        <div className="rm-minute-track">

          <div
            className="rm-minute-fill"
            style={{
              width: `${
                (timeMinute / 55) *
                100
              }%`,
            }}
          />

          <div
            className="rm-minute-thumb"
            style={{
              left: `${
                (timeMinute / 55) *
                100
              }%`,
            }}
          />

        </div>

      </div>


      {/* Buttons */}

      <div className="rm-picker-actions">

        <button
          className="rm-picker-cancel"
          onClick={() =>
            setPicker(null)
          }
        >
          Cancel
        </button>

        <button
          className="rm-picker-select"
          onClick={applyTime}
        >
          Select
        </button>

      </div>

    </div>

  </div>
)}


      {/* =========================
          MORE MENU
      ========================= */}

      {menuId && active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(50,36,22,.35)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 60,
          }}
          onClick={() => setMenuId(null)}
        >
          <div
            style={{
              background: "#fffdfa",
              width: "100%",
              maxWidth: 420,
              borderRadius: "20px 20px 0 0",
              padding: 10,
            }}
            onClick={(ev) =>
              ev.stopPropagation()
            }
          >

            <button
              style={menuButtonStyle}
              onClick={() => {
                setMenuId(null);

                navigate("/add-event", {
                  state: {
                    editEvent: active.raw,
                  },
                });
              }}
            >
              Edit event
            </button>

            <button
              style={menuButtonStyle}
              onClick={() => {
                setMenuId(null);
                openReminder(active);
              }}
            >
              Set reminder
            </button>

            <button
              style={menuButtonStyle}
              onClick={() => {
                setMenuId(null);
                toggleAlert(active.id);
              }}
            >
              {active.alert
                ? "Turn reminder off"
                : "Turn reminder on"}
            </button>

            <button
              style={{
                ...menuButtonStyle,
                color: "#b5423a",
              }}
              onClick={() =>
                deleteEvent(active)
              }
            >
              Delete event
            </button>

          </div>
        </div>
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 24,
            background: "#3a2f26",
            color: "#fdf7ef",
            padding: "10px 16px",
            borderRadius: 999,
            fontSize: 12.5,
            zIndex: 200,
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

const menuButtonStyle = {
  width: "100%",
  textAlign: "left",
  border: "none",
  background: "transparent",
  padding: 14,
  fontSize: 14,
  fontFamily: "inherit",
  color: "#3a2f26",
  cursor: "pointer",
  borderRadius: 12,
};
