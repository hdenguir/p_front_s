import React, { useEffect, useState } from "react";
import styles from "../styles/Events.module.css";
import events from "../input.json";
import Event from "./Event";
import {
  getLeftPositions,
  getEventsWidth,
  eventsFormatter
} from "../utils/events";
import { useWindowSize } from "../hooks/useWindowSize";

const Events = () => {
  const { height: windowHeight } = useWindowSize();

  const heightH = Math.floor(windowHeight / 12);
  const heightM = Math.floor(heightH / 60);

  const [eventsData, setEventsData] = useState([]);

  useEffect(
    () => {
      function fetchEvents() {
        let eventsFormat = eventsFormatter(events, heightH, heightM);

        eventsFormat = getEventsWidth(eventsFormat);
        setEventsData(getLeftPositions(eventsFormat));
      }

      fetchEvents();
    },
    [heightH, heightM]
  );

  return (
    <div className={styles.container}>
      {events.map((e, i) => {
        const startEvent = e.start.split(":");
        const top = (startEvent[0] - 9) * heightH + startEvent[1] * heightM;
        const eventHeight = Math.floor(e.duration * heightM);
        const left = eventsData.length === 0 ? 0 : eventsData[i].left + "%";
        const eventWidth =
          eventsData.length === 0 ? "100%" : eventsData[i].width + "%";
        const eventTop = top * 100 / windowHeight + "%";

        return (
          <div
            className={styles.event}
            key={e.id}
            style={{
              top: eventTop,
              left,
              width: eventWidth
            }}
          >
            <Event id={e.id} eventHeight={eventHeight} />
          </div>
        );
      })}
    </div>
  );
};

export default Events;
