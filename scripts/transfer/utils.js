function toNonExponential(num) {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  if (m) {
    // @ts-ignore
    return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
  }
  return "0";
}

function accFloorInfo(value = 0, exp = 2) {
  if (String(Number(value)) === "NaN" || String(value) == "") {
    return "";
  }
  if (String(value).indexOf(".") > -1 && !String(value).split(".")[1]) {
    return String(value);
  }
  if (value === 0) {
    return String(value);
  }

  let val = String(parseFloat(String(value)));

  if (val.indexOf("e") !== -1) {
    val = toNonExponential(+val);
  }
  if (exp === 0) {
    return val.split(".")[0];
  }
  let pointval = val.split(".")[1];
  if (pointval) {
    for (let i = 0; i < 12; i++) {
      if (pointval.charAt(pointval.length - 1) === "0") {
        pointval = pointval.substr(0, pointval.length - 1);
      }
    }
  }
  const num002 = pointval
    ? String(pointval).length > 0
      ? "." + String(pointval).substring(0, exp)
      : ""
    : "";
  return val.split(".")[0] + num002;
}
