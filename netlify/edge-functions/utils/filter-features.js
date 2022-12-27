export function filterTracksByFeature(tracks, filter) {
  return tracks.filter((t) => {
    const trackValue = t[filter.filterType];
    if (filter.condition === "more than") {
      return trackValue > filter.value;
    } else {
      return trackValue < filter.value;
    }
  });
}
