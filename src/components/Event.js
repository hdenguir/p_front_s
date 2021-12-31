import React from "react";
import styles from "../styles/Events.module.css";

export default function Event({ id, eventHeight }) {
  return (
    <div className={styles.eventItem} style={{ height: eventHeight }}>
      {id}
    </div>
  );
}
