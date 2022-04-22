const { login } = require("./kasper-toolbox/auth");
const { getWorkerships } = require("./kasper-toolbox/room");
const { createTextMessage } = require("./kasper-toolbox/chat");
const { setBotId, setAuthToken } = require("./kasper-toolbox/data/auth");
const { connectSocket, registerEvent } = require("./kasper-toolbox/realtime");
const {
  chessWidgetInitGui,
  timeSecMirror,
  timeMinMirror,
  timeHourMirror,
  onClockBoxClick,
  weatherTempUpdate,
  weatherHumidityUpdate,
  clockTypeMemory,
  piecesStates,
} = require("./gui");
const { gui } = require("./kasper-toolbox/gui");

setBotId("58803ca7-37a8-4915-81d8-7ddc608a778c-1649398629843");
setAuthToken(
  "RuCsd6dMJox5hhzvrRHGYmZvL182wvHmmHPo8oc0CA3OLPfHTBbKWji6OWl4iUIy"
);

let reservedActions = {};
let reservedPieceId = {};

(async () => {
  console.log("starting bot...");
  let { bot, botSecret, session, status } = await login();
  if (status === "error") throw new Error("Could not login.");
  console.log("logged in succesfully");

  connectSocket(async (user) => {
    let { workerships, status0 } = await getWorkerships();
    if (status0 === "error") throw new Error("Could not get workerships.");
    console.log("fetched workerships succesfully");
    // if (workerships.length > 0) {
    //     let {message, status1} = await createTextMessage(workerships[0].roomId, 'hello keyhan !');
    //     if (status1 === 'error') throw new Error('Could not create message.');
    //     console.log('created message succesfully');
    // }

    registerEvent(
      "request_initial_gui",
      async ({ widgetId, userId, roomId, preview, widgetWorkerId }) => {
        console.log(
          "user::" +
            userId +
            " requested init-gui of widget::" +
            widgetId +
            (preview ? " in preview mode." : ".")
        );
        let { status2 } = await gui(
          "init",
          chessWidgetInitGui,
          userId,
          widgetId,
          widgetWorkerId,
          preview,
          roomId,
          true
        );
        if (status2 === "error") throw new Error("Could not init gui.");
        console.log("initialized gui succesfully");
      }
    );
    registerEvent(
      "gui_initialized",
      async ({ widgetId, userId, roomId, widgetWorkerId, preview }) => {
        console.log(
          "user::" +
            userId +
            " notified init-gui of widget::" +
            widgetId +
            " activated."
        );
        console.log("resuscitated widget-worker succesfully");

        //await gui('update', [weatherUpdateCopy, humidityUpdateCopy], userId, widgetId, widgetWorkerId, preview, roomId);
        //await gui('mirror', [timeSecMirror, timeMinMirror, timeHourMirror], userId, widgetId, widgetWorkerId, preview, roomId);
        //await gui('memorize', clockTypeMemory, userId, widgetId, widgetWorkerId, preview, roomId);
        Object.values(piecesStates).forEach(async (piece) => {
          await gui(
            "attachClick",
            {
              elId: piece.id,
              codes: [
                {
                  type: "tellBot",
                },
              ],
            },
            userId,
            widgetId,
            widgetWorkerId,
            preview,
            roomId,
            true
          );
        });
        [0, 1, 2, 3, 4, 5, 6, 7].forEach((y) => {
          [0, 1, 2, 3, 4, 5, 6, 7].forEach(async (x) => {
            await gui(
              "attachClick",
              {
                elId: `block-${x}-${y}`,
                codes: [
                  {
                    type: "tellBot",
                  },
                ],
              },
              userId,
              widgetId,
              widgetWorkerId,
              preview,
              roomId,
              true
            );
            console.log("attached click listener to block.");
          });
        });
      }
    );
    registerEvent(
      "element_clicked",
      async ({
        widgetId,
        userId,
        roomId,
        widgetWorkerId,
        preview,
        elementId,
      }) => {
        console.log(
          "user::" +
            userId +
            " clicked widget::" +
            widgetId +
            " element::" +
            elementId +
            "."
        );

        let updates = [];
        [0, 1, 2, 3, 4, 5, 6, 7].forEach((y) => {
          [0, 1, 2, 3, 4, 5, 6, 7].forEach((x) => {
            updates.push({
              elId: `block-${x}-${y}`,
              property: "background",
              newValue:
                (x % 2 !== 0 && y % 2 === 0) || (x % 2 === 0 && y % 2 !== 0)
                  ? "rgba(0, 0, 0, 1)"
                  : "rgba(255, 255, 255, 1)",
            });
          });
        });

        if (elementId.startsWith("block-")) {
          let anyReservedAction = reservedActions[widgetWorkerId].filter(
            (action) => {
              return action.elId === elementId;
            }
          );
          if (anyReservedAction.length > 0) {
            let position = elementId.substring("block-".length);
            position = position.split("-");
            let x = Number(position[0]);
            let y = Number(position[1]);
            piecesStates[reservedPieceId[widgetWorkerId]].position.x = x;
            piecesStates[reservedPieceId[widgetWorkerId]].position.y = y;
            updates.push({
              elId: reservedPieceId[widgetWorkerId],
              property: "left",
              newValue: `calc(${x} * 12.5%)`,
            });
            updates.push({
              elId: reservedPieceId[widgetWorkerId],
              property: "top",
              newValue: `calc(${y} * 12.5% - 2%)`,
            });
            reservedActions[widgetWorkerId] = [];
          }
        } else {
          if (reservedActions[widgetWorkerId] === undefined)
            reservedActions[widgetWorkerId] = [];
          let killed = false;
          for (let key in reservedActions[widgetWorkerId]) {
            let action = reservedActions[widgetWorkerId][key];
            let position = action.elId.substring("block-".length);
            position = position.split("-");
            let x = Number(position[0]);
            let y = Number(position[1]);
            let foundKill = false;
            for (let piece in Object.values(piecesStates)) {
              if (
                piecesStates[elementId].position.x === x &&
                piecesStates[elementId].position.y === y &&
                ((piecesStates[elementId].id.startsWith("black") &&
                  !reservedPieceId[widgetWorkerId].startsWith("black")) ||
                  (!piecesStates[elementId].id.startsWith("black") &&
                    reservedPieceId[widgetWorkerId].startsWith("black")))
              ) {
                piece.killed = true;
                piecesStates[elementId].position.x = -1000;
                piecesStates[elementId].position.y = -1000;
                updates.push({
                  elId: piecesStates[elementId].id,
                  property: "top",
                  newValue: -1000,
                });
                piecesStates[reservedPieceId[widgetWorkerId]].position.x = x;
                piecesStates[reservedPieceId[widgetWorkerId]].position.y = y;
                updates.push({
                  elId: reservedPieceId[widgetWorkerId],
                  property: "left",
                  newValue: `calc(${x} * 12.5%)`,
                });
                updates.push({
                  elId: reservedPieceId[widgetWorkerId],
                  property: "top",
                  newValue: `calc(${y} * 12.5% - 2%)`,
                });
                reservedActions[widgetWorkerId] = [];
                killed = true;
                foundKill = true;
                break;
              }
            }
            if (foundKill) {
              break;
            }
          }
          if (!killed) {
            let reservedActionsOfMe = [];
            if (piecesStates[elementId].type === "pawn") {
              let anyPieces = Object.values(piecesStates).filter((piece) => {
                return (
                  piece.position.x === piecesStates[elementId].position.x &&
                  piecesStates[elementId].position.y +
                    (piecesStates[elementId].id.startsWith("black")
                      ? -1
                      : +1) ===
                    piece.position.y
                );
              });
              if (anyPieces.length === 0) {
                reservedActionsOfMe.push({
                  elId: `block-${piecesStates[elementId].position.x}-${
                    piecesStates[elementId].position.y +
                    (piecesStates[elementId].id.startsWith("black") ? -1 : +1)
                  }`,
                  property: "background",
                  newValue: "rgba(0, 255, 0, 1)",
                });
                if (
                  (piecesStates[elementId].id.startsWith("black") &&
                    piecesStates[elementId].position.y === 6) ||
                  (!piecesStates[elementId].id.startsWith("black") &&
                    piecesStates[elementId].position.y === 1)
                ) {
                  reservedActionsOfMe.push({
                    elId: `block-${piecesStates[elementId].position.x}-${
                      piecesStates[elementId].position.y +
                      (piecesStates[elementId].id.startsWith("black") ? -2 : +2)
                    }`,
                    property: "background",
                    newValue: "rgba(0, 255, 0, 1)",
                  });
                }
              }
              let anyPiecesToCatch = Object.values(piecesStates).filter(
                (piece) => {
                  return (
                    (piece.position.x - 1 ===
                      piecesStates[elementId].position.x ||
                      piece.position.x + 1 ===
                        piecesStates[elementId].position.x) &&
                    piecesStates[elementId].position.y +
                      (piecesStates[elementId].id.startsWith("black")
                        ? -1
                        : +1) ===
                      piece.position.y
                  );
                }
              );
              anyPiecesToCatch.forEach((piece) => {
                if (piece.type !== "king") {
                  reservedActionsOfMe.push({
                    elId: `block-${piece.position.x}-${piece.position.y}`,
                    property: "background",
                    newValue: "rgba(0, 255, 0, 1)",
                  });
                }
              });
              reservedActions[widgetWorkerId] = reservedActionsOfMe;
              reservedPieceId[widgetWorkerId] = elementId;
              updates = updates.concat(reservedActionsOfMe);
            } else if (piecesStates[elementId].type === "rook") {
              for (let i = piecesStates[elementId].position.x + 1; i < 8; i++) {
                let anyWall = Object.values(piecesStates).filter((piece) => {
                  return (
                    piece.position.x === i &&
                    piece.position.y === piecesStates[elementId].position.y
                  );
                });
                if (anyWall.length > 0) {
                  if (
                    anyWall[0].team !== piecesStates[elementId].team &&
                    anyWall[0].type !== "king"
                  ) {
                    reservedActionsOfMe.push({
                      elId: `block-${i}-${piecesStates[elementId].position.y}`,
                      property: "background",
                      newValue: "rgba(0, 255, 0, 1)",
                    });
                  }
                  break;
                } else {
                  reservedActionsOfMe.push({
                    elId: `block-${i}-${piecesStates[elementId].position.y}`,
                    property: "background",
                    newValue: "rgba(0, 255, 0, 1)",
                  });
                }
              }
              for (
                let i = piecesStates[elementId].position.x - 1;
                i >= 0;
                i--
              ) {
                let anyWall = Object.values(piecesStates).filter((piece) => {
                  return (
                    piece.position.x === i &&
                    piece.position.y === piecesStates[elementId].position.y
                  );
                });
                if (anyWall.length > 0) {
                  if (
                    anyWall[0].team !== piecesStates[elementId].team &&
                    anyWall[0].type !== "king"
                  ) {
                    reservedActionsOfMe.push({
                      elId: `block-${i}-${piecesStates[elementId].position.y}`,
                      property: "background",
                      newValue: "rgba(0, 255, 0, 1)",
                    });
                  }
                  break;
                } else {
                  reservedActionsOfMe.push({
                    elId: `block-${i}-${piecesStates[elementId].position.y}`,
                    property: "background",
                    newValue: "rgba(0, 255, 0, 1)",
                  });
                }
              }
              for (let i = piecesStates[elementId].position.y + 1; i < 8; i++) {
                let anyWall = Object.values(piecesStates).filter((piece) => {
                  return (
                    piece.position.x === piecesStates[elementId].position.x &&
                    piece.position.y === i
                  );
                });
                if (anyWall.length > 0) {
                  if (
                    anyWall[0].team !== piecesStates[elementId].team &&
                    anyWall[0].type !== "king"
                  ) {
                    reservedActionsOfMe.push({
                      elId: `block-${piecesStates[elementId].position.x}-${i}`,
                      property: "background",
                      newValue: "rgba(0, 255, 0, 1)",
                    });
                  }
                  break;
                } else {
                  reservedActionsOfMe.push({
                    elId: `block-${piecesStates[elementId].position.x}-${i}`,
                    property: "background",
                    newValue: "rgba(0, 255, 0, 1)",
                  });
                }
              }
              for (
                let i = piecesStates[elementId].position.y - 1;
                i >= 0;
                i--
              ) {
                let anyWall = Object.values(piecesStates).filter((piece) => {
                  return (
                    piece.position.x === piecesStates[elementId].position.x &&
                    piece.position.y === i
                  );
                });
                if (anyWall.length > 0) {
                  if (
                    anyWall[0].team !== piecesStates[elementId].team &&
                    anyWall[0].type !== "king"
                  ) {
                    reservedActionsOfMe.push({
                      elId: `block-${piecesStates[elementId].position.x}-${i}`,
                      property: "background",
                      newValue: "rgba(0, 255, 0, 1)",
                    });
                  }
                  break;
                } else {
                  reservedActionsOfMe.push({
                    elId: `block-${piecesStates[elementId].position.x}-${i}`,
                    property: "background",
                    newValue: "rgba(0, 255, 0, 1)",
                  });
                }
              }
              reservedActions[widgetWorkerId] = reservedActionsOfMe;
              reservedPieceId[widgetWorkerId] = elementId;
              updates = updates.concat(reservedActionsOfMe);
            } else if (piecesStates[elementId].type === "knight") {
              const validationChoice = (x, y) => {
                let anyPieces = Object.values(piecesStates).filter(piece => {
                    return (
                        (piece.position.x === x &&
                        piece.position.y === y) &&
                        (piece.type === "king" ||
                        piece.team === piecesStates[elementId].team)
                    );
                });
                if (anyPieces.length === 0) {
                  reservedActionsOfMe.push({
                    elId: `block-${x}-${y}`,
                    property: "background",
                    newValue: "rgba(0, 255, 0, 1)",
                  });
                }
              };

              validationChoice(
                piecesStates[elementId].position.x - 1,
                piecesStates[elementId].position.y - 2
              );
              validationChoice(
                piecesStates[elementId].position.x + 1,
                piecesStates[elementId].position.y - 2
              );
              validationChoice(
                piecesStates[elementId].position.x - 1,
                piecesStates[elementId].position.y + 2
              );
              validationChoice(
                piecesStates[elementId].position.x + 1,
                piecesStates[elementId].position.y + 2
              );
              validationChoice(
                piecesStates[elementId].position.x - 2,
                piecesStates[elementId].position.y - 1
              );
              validationChoice(
                piecesStates[elementId].position.x - 2,
                piecesStates[elementId].position.y + 1
              );
              validationChoice(
                piecesStates[elementId].position.x + 2,
                piecesStates[elementId].position.y - 1
              );
              validationChoice(
                piecesStates[elementId].position.x + 2,
                piecesStates[elementId].position.y + 1
              );
              reservedActions[widgetWorkerId] = reservedActionsOfMe;
              reservedPieceId[widgetWorkerId] = elementId;
              updates = updates.concat(reservedActionsOfMe);
            }
          }
        }

        await gui(
          "update",
          updates,
          userId,
          widgetId,
          widgetWorkerId,
          preview,
          roomId,
          true
        );
      }
    );
    registerEvent("user_joined", async ({ user, room }) => {
      console.log(user.firstName + " joined room.");
      let { message, status4 } = await createTextMessage(
        room.id,
        "سلام " +
          user.firstName +
          " " +
          user.lastName +
          " . به روم ما خوش آمدید ."
      );
      if (status4 === "error") throw new Error("Could not create message.");
      console.log("created message succesfully");
    });
  });
})();
