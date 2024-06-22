import { motion } from "framer-motion";
function Tooltip({ content }) {
  <div
    // initial={{ opacity: 0, scale: 0.5 }}
    // animate={{ opacity: 1, scale: 1 }}
    className="p-1.5 z-10 w-[100px] bg-tertiaryBg text-white"
  >
    {content}
  </div>;
}

export default Tooltip;
