"use client";

import { useEffect, useState } from "react";

const TRAIN = String.raw`      ====        ________
  _D _|  |_______/        \__I_I_____===__|______
   |(_)---  |   H\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__-------------------| [___] |
  |______|__|___H__/__|_____/[][]~\______|       |
  | =|  o |=-~~\  /~~\  /~~\  /~~\ ___Y__________|_
   \_/      \_O=====O=====O=====O/      \_/`;

export default function SlTrain() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setDone(true), 3600);
    return () => clearTimeout(t);
  }, []);

  if (done)
    return (
      <div className="text-stone-500 dark:text-stone-500">
        (the train has left — it was `ls`, wasn&apos;t it?)
      </div>
    );
  return (
    <div className="overflow-hidden">
      <pre className="text-stone-500 dark:text-stone-400 text-[10px] leading-tight whitespace-pre animate-sl-train">
        {TRAIN}
      </pre>
    </div>
  );
}
