var ws = null;    // websocket

// request data
var json = [
  { ticket: 'ticket' },
  // { type: 'trade', codes: Upbit_Markets },
  // { type: 'orderbook', codes: Upbit_Markets, isOnlyRealtime: true },
  // { type: 'ticker', codes: Upbit_Markets }
  { type: 'ticker', codes: ["KRW-BTC"] }
];

// 업비트 웹소켓 통신 시작함
function initWebSocket() {
  // 웹소켓 생성
  ws = new WebSocket('wss://api.upbit.com/websocket/v1');
  ws.binaryType = 'blob';

  // 콜백 이벤트 설정
  ws.onopen = function(evt){ onOpen(evt); };
  ws.onclose = function(evt){ onClose(evt);};
  ws.onmessage = function(evt){ onMessage(evt);};
  ws.onerror = function(evt){ onError(evt);};

  // 현재 날짜 출력
  var date_str = today();
  $("#today").text(date_str);
}

// 업비트 목록을 생성
// var Upbit_Markets = []; 
// jQuery.get('https://api.upbit.com/v1/market/all', function(data){
//   if(typeof data == 'object'){
//     for(var i in data){
//       Upbit_Markets.push(data[i].market);
//     };
//   };
// });


function onOpen() {
  // 웹소켓 상태 체크, 웹소켓이 열려있으면 데이터 전송.
  if(ws.readyState == 1) {
    $("#output").text("websocket connected");
    $("#output").css("color", "green");
    ws.send(JSON.stringify(json));
  } else {
    // 닫혀있으면 새로 소켓 생성 연결
    initWebSocket();
  }
}

function onClose() {
  $("#output").text("websocket disconnected");
  $("#output").css("color", "red");
  ws.close();
}

function onMessage(e) {
  var reader = new FileReader();
  reader.readAsText(e.data);
  reader.onload = function(){

    var result = JSON.parse(reader.result);
    // trade_price 데이터에 ',' 넣기
    var comma_price = comma(result.trade_price);
    // change_rate, 소수점 2째자리까지
    var rate = (result.change_rate * 100).toFixed(2) + "%";
    // change_price
    var change_price = comma(result.change_price);

    // 텍스트 출력
    $("#price").text(comma_price);
    $("#rate").text(rate);
    $("#change_price").text("("+change_price+")");

    // price에 background 깜빡임 효과 주기
    $("#price").css("background", "pink");
    // 0.1s 후에 background 원래대로
    setTimeout(function() {
      $("#price").css("background", "white");
    }, 100)

    // 현재가가 전일대비 rise면 빨간색, fall은 파란색, 같으면 검정색
    if(result.change == "RISE") {
      $("#price").css("color", "red");
      $("#rate").css("color", "red");
      $("#change_price").css({"color": "red", "font-size": 12});
    } else
    if(result.change == "FALL"){
      $("#price").css("color", "blue");
      $("#rate").css("color", "blue");
      $("#change_price").css({"color": "blue", "font-size": 12});
    } else {
      $("#price").css("color", "black");
      $("#rate").css("color", "black");
      $("#change_price").css({"color": "black", "font-size": 12});
    }

    console.log(result);

    // chart로 데이터 넘겨주기
    draw_chart(result);
  };
}

function onError(e) {
  $("#output").text("에러: " + e.data);
}


// node 생성
// function writeToScreen(message) {
//   var pre = document.createElement("p");
//   pre.style.wordWrap = "break-word";
//   pre.innerHTML = message;
//   output.appendChild(pre);
// }

// 숫자 세자리마다 콤마 표시
function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}
 
// 현재 날짜 표시
function today() {
  var date = new Date();
  var year = date.getFullYear();
  var month = new String(date.getMonth() + 1);
  var day = new String(date.getDate());

  // 한자리수일 경우 0을 채워준다. 
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
}
