import React from "react";

export default function Chip(props) {
  const { content, onRemove, disabled } = props;

  return (
    <div className="">
      <span
        id="badge-dismiss-dark"
        className="inline-flex items-center px-2 py-1 text-sm font-semibold text-black   bg-green-400  rounded "
      >
        {content}
        {!disabled && (
          <button
            onClick={onRemove}
            type="button"
            className="inline-flex items-center p-1 ms-2 text-sm text-black bg-transparent rounded-sm hover:bg-green-200 hover:text-gray-900 "
            data-dismiss-target="#badge-dismiss-dark"
            aria-label="Remove"
          >
            <svg
              className="w-2 h-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only text-black">Remove badge</span>
          </button>
        )}
      </span>
    </div>
  );
}
