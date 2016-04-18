'use strict';
export default function(props) {
  return {
    out: {
      container: {
        style: {
          opacity: 0
        }
      }
    },
    idle: {
      container: {
        style: {
          opacity: 1
        }
      }
    }
  };
};