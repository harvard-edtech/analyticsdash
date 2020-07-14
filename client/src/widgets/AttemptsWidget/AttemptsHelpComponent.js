/**
 * Help for AttemptsWidget
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';

/* ---------------------------- Class --------------------------- */

class HelpComponent extends Component {
  /**
   * Render HelpComponent
   * @author Aryan Pandey
   */
  render() {
    return (
      <div>
        <h4>
          THIS SECTION IS A WORK IN PROGRESS!!! <br />
          Definitions: 
        </h4>

        <div className="list-group text-left">
          {/* Mean */}
          <li className="list-group-item pt-1 pb-1 pr-1 pl-2">
            <strong>
              Mean:&nbsp;
            </strong>
            an average of all the scores.
            <div className="small">
              The mean is a better indicator than the median if you anticipate
              large jumps in the grade curve
              (example: some students got a low score, some got a high score,
              but very few got an average score).
            </div>
          </li>

          {/* Median */}
          <li className="list-group-item pt-1 pb-1 pr-1 pl-2">
            <strong>
              Median:&nbsp;
            </strong>
            half the students scored above this score and half scored below it.
            <div className="small">
              The median is a better indicator than the mean if you anticipate
              outlier scores
              (example: some students got very low scores or some students
              got lots of extra credit).
            </div>
          </li>

          {/* Standard Deviation */}
          <li className="list-group-item pt-1 pb-1 pr-1 pl-2">
            <strong>
              SD:&nbsp;
            </strong>
            standard deviation, how spread out scores were.
            <div className="small">
              A large standard deviation means scores varied a lot.
              A small standard deviation means scores didn&apos;t vary by
              that much.
            </div>
          </li>
        </div>
      </div>
    );
  }
}

export default HelpComponent;
