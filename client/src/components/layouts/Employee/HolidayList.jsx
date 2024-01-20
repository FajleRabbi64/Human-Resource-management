import React, { Component } from "react";

export default class HolidayList extends Component {
  render() {
    return (
      <div
        className="jumbotron text-center pt-3"
        style={{ height: "460px", overflowY: "scroll" }}
      >
        <h1>List Of Holidays</h1>

        <div className="row">
          <div className="col">
            <h5>Date</h5>
          </div>
          <div className="col">
            <h5>Day</h5>
          </div>
          <div className="col">
            <h5>Occasion</h5>
          </div>
        </div>
        <hr />

        <div className="row">
          <div className="col">21 Feb 2023</div>
          <div className="col">Tuesday</div>
          <div className="col">Shaheed Day</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">8 Mar 2023</div>
          <div className="col">Wednesday</div>
          <div className="col">Shab e-Barat</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">17 Mar 2023</div>
          <div className="col">Friday</div>
          <div className="col">Sheikh Mujibur Rahman's Birthday</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">26 Mar 2023</div>
          <div className="col">Sunday</div>
          <div className="col">Independence Day</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">14 Apr 2023</div>
          <div className="col">Friday</div>
          <div className="col">	Bengali New Year</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">19 Apr 2023</div>
          <div className="col">Wed</div>
          <div className="col">Laylat al-Qadr</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">21 Apr 2023</div>
          <div className="col">Fri</div>
          <div className="col">Jumatul Bidah</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">22 Apr 2023</div>
          <div className="col">	Sat</div>
          <div className="col">Eid ul-Fitr</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">23 Apr 2023</div>
          <div className="col">Sun</div>
          <div className="col">	Eid ul-Fitr Holiday</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">1 May 2023</div>
          <div className="col">Mon</div>
          <div className="col">May Day</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">4 May 2023</div>
          <div className="col">	Thu</div>
          <div className="col">Buddha Purnima</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">28 Jun 2023</div>
          <div className="col">Wed</div>
          <div className="col">Eid ul-Adha Holiday</div>
        </div>
        <hr />
      </div>
    );
  }
}
