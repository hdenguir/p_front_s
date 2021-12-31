export const sortEvents = (events, sortedBy = "start") => {
  return events.sort((a, b) => {
    const currentHour = parseInt(a[sortedBy].replace(":", ""));
    const nextHour = parseInt(b[sortedBy].replace(":", ""));

    if (currentHour < nextHour) return -1;

    if (currentHour > nextHour) return 1;

    if (currentHour === nextHour) {
      if (a.duration < b.duration) return -1;

      if (a.duration > b.duration) return 1;

      return 0;
    }
    return 0;
  });
};

const setItemWidth = overItem => {
  let alignmentCount = 0;
  if (
    overItem.length === 3 &&
    (overItem[0].bottom <= overItem[overItem.length - 1].top ||
      (overItem[0].bottom > overItem[1].bottom &&
        overItem[0].bottom > overItem[2].bottom))
  ) {
    for (let i = 0; i < overItem.length; i++) overItem[i].width = 50;
  } else {
    for (let j = 0; j < overItem.length; j++) {
      if (
        overItem[j].top === overItem[0].top ||
        overItem[j].top < overItem[0].bottom
      )
        alignmentCount += 1;
    }
    if (alignmentCount === overItem.length) {
      for (let k = 0; k < overItem.length; k++)
        overItem[k].width = 100 / overItem.length;
    } else
      for (let l = 0; l < overItem.length; l++)
        overItem[l].width = 100 / alignmentCount;
  }
};

export const getEventsWidth = events => {
  let overItem = [];
  for (let j = 0; j < events.length; j++) {
    if (j === 0) {
      if (events[j].bottom > events[j + 1].top) overItem.push(events[j]);
    } else if (j === events.length - 1) {
      for (let k = 0; k < events.length / 2; k++) {
        if (
          events[j].top > events[j - k].top &&
          events[j].bottom < events[j - k].bottom
        ) {
          events[j].width = events[j - k].width;
        }
      }
    } else if (events[j].bottom <= events[j + 1].top) {
      overItem.push(events[j]);
      setItemWidth(overItem, events);
      overItem = [];
    } else overItem.push(events[j]);
  }
  return events;
};

const moveLeft = (eventsPs, events, current) => {
  let doubleOverlap = 0;
  for (let k = 0; k < events.length; k++) {
    if (
      current !== events[k] &&
      current.top < events[k].top &&
      current.bottom > events[k].bottom
    ) {
      eventsPs[eventsPs.indexOf(current)].left = 50;

      break;
    } else {
      if (
        current.top < events[k].top &&
        current.bottom > events[k].top &&
        current.bottom < events[k].bottom
      )
        doubleOverlap += 1;

      if (
        current.top > events[k].top &&
        current.top < events[k].bottom &&
        current.bottom > events[k].bottom
      )
        doubleOverlap += 1;
    }
    if (doubleOverlap === 2) eventsPs[eventsPs.indexOf(current)].left = 50;
  }
};

const getLeftPosition = (eventsPack, eventsPs) => {
  if (eventsPack.length > 1) {
    for (let j = 0; j < eventsPack.length; j++) {
      let item = eventsPs[eventsPs.indexOf(eventsPack[j])];
      if (eventsPack[j].width === 100 / eventsPack.length) {
        item.left = eventsPack[j].width * j;
      } else if (eventsPack[j].width === 50 && eventsPack.length > 2) {
        moveLeft(eventsPs, eventsPack, eventsPack[j]);
      } else {
        const _left = eventsPack[j].width * j;
        item.left = _left >= 100 ? 0 : _left;
      }
    }
  } else if (eventsPack[0] === eventsPs[eventsPs.length - 1]) {
    eventsPs[eventsPs.indexOf(eventsPack[0])].left = 50;
  }
};

export const getLeftPositions = events => {
  const eventsList = sortEvents(events);
  let itemsDone = [];
  eventsList.forEach(e => {
    if (!itemsDone.includes(e)) {
      let newPack = [e];
      for (let i = events.indexOf(e); i < events.length; i++) {
        const current = i === events.indexOf(e) ? e : events[i];
        if (
          i === 0 ||
          (current.top < events[i - 1].bottom &&
            current.top >= events[i - 1].top)
        ) {
          if (events[i] !== e) newPack.push(events[i]);
          if (i !== events.length - 1 && current.bottom <= events[i + 1].top) {
            getLeftPosition(newPack, events);

            break;
          }
        } else if (current.top >= events[i - 1].bottom)
          if (i !== events.length - 1 && current.bottom <= events[i + 1].top)
            break;
          else if (i === events.length - 1) events[i].left = events[i].width;
      }
      itemsDone.push(...newPack);
    }
  });
  return events;
};

export const eventsFormatter = (events, heightH, heightM) => {
  const eventsList = sortEvents(events);

  return eventsList.map(e => {
    const startEvent = e.start.split(":");
    const top = (startEvent[0] - 9) * heightH + startEvent[1] * heightM;
    const eventHeight = e.duration * heightM;
    const bottom = top + eventHeight;

    return {
      ...e,
      id: e.id,
      start: e.start,
      top,
      bottom,
      left: 0,
      width: 100
    };
  });
};
