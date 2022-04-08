let timeSecMirror = {
  elId: "secondHand",
  property: "transform",
  value: "rotate(calc(((@timeSec + 1) * 6deg) - 90deg))",
  variable: { id: "timeSec", from: "time.now.seconds" },
};
let timeMinMirror = {
  elId: "minuteHand",
  property: "transform",
  value: "rotate(calc((@timeMin * 6deg) - 90deg))",
  variable: { id: "timeMin", from: "time.now.minutes" },
};
let timeHourMirror = {
  elId: "hourHand",
  property: "transform",
  value: "rotate(calc((@timeHour * 30deg) + 18deg - 90deg))",
  variable: { id: "timeHour", from: "time.now.hours" },
};
let clockTypeMemory = {
  memoryId: "clockType",
  value: "clock",
};
let onClockBoxClick = {
  elId: "clockBox",
  codes: [
    {
      type: "conditionList",
      conditions: [
        {
          item1: {
            type: "memory",
            memoryId: "clockType",
          },
          item2: {
            type: "constant",
            constant: "clock",
          },
          type: "e",
          then: [
            {
              type: "straight",
              updateType: "gui",
              elId: "clockBox",
              property: "transform",
              newValue: "rotateY(-360deg)",
            },
            {
              type: "straight",
              updateType: "memory",
              memoryId: "clockType",
              value: "weather",
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "clockBackImage",
              property: "display",
              newValue: "none",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "clockBackShadow",
              property: "display",
              newValue: "none",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "secondHand",
              property: "display",
              newValue: "none",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "minuteHand",
              property: "display",
              newValue: "none",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "hourHand",
              property: "display",
              newValue: "none",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "clockMsg",
              property: "display",
              newValue: "block",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "weather",
              property: "display",
              newValue: "block",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "weatherMsg",
              property: "display",
              newValue: "block",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "humidity",
              property: "display",
              newValue: "block",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "weatherHumidity",
              property: "display",
              newValue: "block",
              delay: 240,
            },
          ],
        },
        {
          item1: {
            type: "memory",
            memoryId: "clockType",
          },
          item2: {
            type: "constant",
            constant: "weather",
          },
          type: "e",
          then: [
            {
              type: "straight",
              updateType: "gui",
              elId: "clockBox",
              property: "transform",
              newValue: "rotateY(0deg)",
            },
            {
              type: "straight",
              updateType: "memory",
              memoryId: "clockType",
              value: "clock",
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "clockBackImage",
              property: "display",
              newValue: "block",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "clockBackShadow",
              property: "display",
              newValue: "block",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "secondHand",
              property: "display",
              newValue: "block",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "minuteHand",
              property: "display",
              newValue: "block",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "hourHand",
              property: "display",
              newValue: "block",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "clockMsg",
              property: "display",
              newValue: "none",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "weather",
              property: "display",
              newValue: "none",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "weatherMsg",
              property: "display",
              newValue: "none",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "humidity",
              property: "display",
              newValue: "none",
              delay: 240,
            },
            {
              type: "straight",
              updateType: "gui",
              elId: "weatherHumidity",
              property: "display",
              newValue: "none",
              delay: 240,
            },
          ],
        },
      ],
    },
  ],
};
let weatherTempUpdate = {
  elId: "weatherMsg",
  property: "styledContent",
  newValue: "-",
};
let weatherHumidityUpdate = {
  elId: "weatherHumidity",
  property: "styledContent",
  newValue: "-",
};

let piecesStates = {
  whiteRokh: {
    position: { x: 0, y: 0 },
    icon: {
      url: "https://audioplayer.kasperian.cloud/rook.png",
    },
  },
  whiteAsb: { position: { x: 1, y: 0 },
    icon: {
      url: "https://audioplayer.kasperian.cloud/knight.png",
    }, },
  whiteFil: { position: { x: 2, y: 0 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/bishop.png",
  }, },
  whiteVazir: { position: { x: 3, y: 0 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/queen.png",
  }, },
  whiteShah: { position: { x: 4, y: 0 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/king.png",
  }, },
  whiteFil2: { position: { x: 5, y: 0 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/bishop.png",
  }, },
  whiteAsb2: { position: { x: 6, y: 0 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/knight.png",
  }, },
  whiteRokh2: { position: { x: 7, y: 0 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/rook.png",
  }, },
  whiteSarbaz: { position: { x: 0, y: 1 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawn.png",
  }, },
  whiteSarbaz2: { position: { x: 1, y: 1 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawn.png",
  }, },
  whiteSarbaz3: { position: { x: 2, y: 1 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawn.png",
  }, },
  whiteSarbaz4: { position: { x: 3, y: 1 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawn.png",
  }, },
  whiteSarbaz5: { position: { x: 4, y: 1 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawn.png",
  }, },
  whiteSarbaz6: { position: { x: 5, y: 1 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawn.png",
  }, },
  whiteSarbaz7: { position: { x: 6, y: 1 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawn.png",
  }, },
  whiteSarbaz8: { position: { x: 7, y: 1 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawn.png",
  }, },

  
  blackRokh: {
    position: { x: 0, y: 7 },
    icon: {
      url: "https://audioplayer.kasperian.cloud/rookBlack.png",
    },
  },
  blackAsb: { position: { x: 1, y: 7 },
    icon: {
      url: "https://audioplayer.kasperian.cloud/knightBlack.png",
    }, },
  blackFil: { position: { x: 2, y: 7 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/bishopBlack.png",
  }, },
  blackVazir: { position: { x: 3, y: 7 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/queenBlack.png",
  }, },
  blackShah: { position: { x: 4, y: 7 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/kingBlack.png",
  }, },
  blackFil2: { position: { x: 5, y: 7 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/bishopBlack.png",
  }, },
  blackAsb2: { position: { x: 6, y: 7 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/knightBlack.png",
  }, },
  blackRokh2: { position: { x: 7, y: 7 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/rookBlack.png",
  }, },
  blackSarbaz: { position: { x: 0, y: 6 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawnBlack.png",
  }, },
  blackSarbaz2: { position: { x: 1, y: 6 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawnBlack.png",
  }, },
  blackSarbaz3: { position: { x: 2, y: 6 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawnBlack.png",
  }, },
  blackSarbaz4: { position: { x: 3, y: 6 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawnBlack.png",
  }, },
  blackSarbaz5: { position: { x: 4, y: 6 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawnBlack.png",
  }, },
  blackSarbaz6: { position: { x: 5, y: 6 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawnBlack.png",
  }, },
  blackSarbaz7: { position: { x: 6, y: 6 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawnBlack.png",
  }, },
  blackSarbaz8: { position: { x: 7, y: 6 },
  icon: {
    url: "https://audioplayer.kasperian.cloud/pawnBlack.png",
  }, },
};

let chessWidgetInitGui = {
  type: "Box",
  id: "clockBox",
  width: "100%",
  height: "100%",
  transition: "transform 1s",
  position: "relative",
  borderRadius: 32,
  background: "rgba(255, 255, 255, 1)",
  children: [
    {
      type: "Box",
      id: "clockBackImage",
      width: "100%",
      height: "100%",
      borderRadius: 32,
      position: "absolute",
      left: 0,
      top: 0,
      children: [0, 1, 2, 3, 4, 5, 6, 7].map((y) => {
        return {
          type: "Box",
          width: "100%",
          height: "12.5%",
          children: [0, 1, 2, 3, 4, 5, 6, 7].map((x) => {
            return {
              type: "Box",
              width: "12.5%",
              height: "12.5%",
              position: "absolute",
              left: `calc(${x} * 12.5%)`,
              top: `calc(${y} * 12.5%)`,
              borderRadius:
                x === 0 && y === 0
                  ? "32px 0 0 0"
                  : x === 7 && y === 0
                  ? "0 32px 0 0"
                  : x === 0 && y === 7
                  ? "0 0 0 32px"
                  : x === 7 && y === 7
                  ? "0 0 32px 0"
                  : 0,
              background:
                (x % 2 !== 0 && y % 2 === 0) || (x % 2 === 0 && y % 2 !== 0)
                  ? "rgba(0, 0, 0, 1)"
                  : "rgba(255, 255, 255, 1)",
            };
          }),
        };
      }),
    },
    {
      type: "Box",
      position: "relative",
      width: "100%",
      height: "100%",
      children: Object.values(piecesStates).map(piece => (
        {
          type: "Image",
          position: "absolute",
          left: `calc(${piece.position.x} * 12.5%)`,
          top: `calc(${piece.position.y} * 12.5% - 2%)`,
          width: "12.5%",
          height: "10%",
          src: piece.icon.url,
        }
      ))
    },
  ],
};

module.exports = {
  weatherHumidityUpdate: weatherHumidityUpdate,
  weatherTempUpdate: weatherTempUpdate,
  clockTypeMemory: clockTypeMemory,
  onClockBoxClick: onClockBoxClick,
  timeHourMirror: timeHourMirror,
  timeMinMirror: timeMinMirror,
  timeSecMirror: timeSecMirror,
  chessWidgetInitGui: chessWidgetInitGui,
};
