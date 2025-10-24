import { useEffect, useState } from "react";

export default function useMediaQuery(query) {
  const get = () => window.matchMedia(query).matches;
//   console.log(get());
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mql = window.matchMedia(query);
    console.log(mql);
    const on = () => {setMatches(mql.matches);console.log(mql)};
    mql.addEventListener?.("change", on);
    return () => mql.removeEventListener?.("change", on);
  }, [query]);
  return matches;
}
