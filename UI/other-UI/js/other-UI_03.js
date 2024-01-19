'use strict';

/* other-UI 03 */
/* カレンダー */

/* Reference study site */

/* JavaScriptでカレンダーを作ろう */
/* URL: https://dotinstall.com/lessons/calendar_js */

/* 詳細な挙動や課題について ここに記載する */

/* カレンダー全体で6週分表示することで、カレンダーの高さを常に統一する。 */



{
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();



  function getCalendarHead() {
    const dates = [];
    const d = new Date(year, month, 0).getDate();
    const n = new Date(year, month, 1).getDay();

    for (let i = 0; i < n; i++) {
      dates.unshift({
        date: d - i,
        isToday: false,
        isDisabled: true,
      });
    }

    return dates;
  }



  function getCalendarBody() {
    const dates = [];
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= lastDate; i++) {
      dates.push({
        date: i,
        isToday: false,
        isDisabled: false,
      });
    }

    if (year === today.getFullYear() && month === today.getMonth()) {
      dates[today.getDate() - 1].isToday = true;
    }

    return dates;
  }



  function getCalendarTail() {
    const dates = [];
    const lastDay = new Date(year, month + 1, 0).getDay();

    for (let i = 1; i < 7 - lastDay + 14; i++) {
      // weeksMaxCount(最大6週分)に対応するために、+2週分 date プロパティを確保しておく。
      dates.push({
        date: i,
        isToday: false,
        isDisabled: true,
      });
    }

    return dates;
  }



  function clearCalendar() {
    const tbody = document.querySelector('tbody');

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }



  function renderTitle() {
    const title = `${year}/${String(month + 1).padStart(2, '0')}`;
    document.getElementById('title').textContent = title;
  }



  function renderWeeks() {
    const dates = [
      ...getCalendarHead(),
      ...getCalendarBody(),
      ...getCalendarTail(),
    ];

    const weeks = [];
    const weeksMaxCount = 6;
    // カレンダー全体を通して高さを統一するための処理
    // 最大で6週分必要。月初が土曜日に始まる場合など
    // 最小は4週分。2月の月初が日曜日に始まる場合など（※稀なケース）

    for (let i = 0; i < weeksMaxCount; i++) {
      weeks.push(dates.splice(0, 7));
    }

    weeks.forEach(week => {
      const tr = document.createElement('tr');

      week.forEach(date => {
        const td = document.createElement('td');

        td.textContent = date.date;
        if (date.isToday) {
          td.classList.add('today');
        }
        if (date.isDisabled) {
          td.classList.add('disabled');
        }

        tr.appendChild(td);
      });

      document.querySelector('tbody').appendChild(tr);

    });
  }



  function createCalendar() {
    clearCalendar();
    renderTitle();
    renderWeeks();
  }



  document.getElementById('prev').addEventListener('click', () => {
    month--;
    if (month < 0) {
      year--;
      month = 11;
    }
    createCalendar();
  });

  document.getElementById('next').addEventListener('click', () => {
    month++;
    if (month > 11) {
      year++;
      month = 0;
    }
    createCalendar();
  });

  document.getElementById('today').addEventListener('click', () => {
    year = today.getFullYear();
    month = today.getMonth();
    createCalendar();
  });

  createCalendar();
}